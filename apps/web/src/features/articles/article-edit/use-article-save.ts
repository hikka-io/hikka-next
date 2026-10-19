import { useEffect, useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { toast } from 'sonner';

import {
    type ArticleDocumentResponse,
    ContentTypeEnum,
    createArticleMutation,
    updateArticleMutation,
} from '@hikka/api';
import { contentPath } from '@hikka/core';

import { apiErrorMessage } from '@/utils/api/api-error-message';
import { invalidateArticles } from '@/utils/api/invalidate-content-state';
import { MUTATION_META_SKIP_ERROR_TOAST } from '@/utils/api/mutation-meta';
import { useRouter } from '@/utils/navigation';

import {
    type ArticleContentBody,
    buildArticleContent,
    canSaveArticle,
} from './article-body';
import { useArticleStoreApi } from './article-provider';
import { ARTICLE_EDITABLE_KEYS, type ArticleStore } from './article-store';

/** Quiet time before an edit is compared with the saved version; undoing back to it clears `dirty`. */
const SETTLE_DELAY_MS = 500;

const SAVE_ERROR = 'Не вдалося зберегти статтю.';

const articleUrl = (slug: string) => contentPath(ContentTypeEnum.ARTICLE, slug);

// `code`, not `key`: on a Cyrillic layout the S key types another letter.
const isSaveShortcut = (event: KeyboardEvent) =>
    (event.metaKey || event.ctrlKey) && event.code === 'KeyS';

/** History state the `new` entry keeps once its article exists, see `readCreatedArticle`. */
const CREATED_ARTICLE_KEY = 'createdArticle';

/** The article a revisited `new` history entry already created, if any. */
export const readCreatedArticle = (state: unknown): string | undefined => {
    const slug = (state as Record<string, unknown> | undefined)?.[
        CREATED_ARTICLE_KEY
    ];
    return typeof slug === 'string' ? slug : undefined;
};

export const selectUnsavedBlocking = (state: ArticleStore) => state.save.dirty;

export const selectSaveDisabled = (state: ArticleStore) =>
    !state.save.dirty ||
    state.save.status === 'saving' ||
    !canSaveArticle(state);

export const selectPublishDisabled = (state: ArticleStore) =>
    state.save.status === 'saving' || !canSaveArticle(state);

/**
 * Saves only on request: `save` keeps a draft a draft (or updates a
 * published article), `publish` makes a draft public. Saves run one at a time,
 * so a new article is created once and every later save updates it. Status
 * lives in the store's `save` field.
 */
export function useArticleSave() {
    const store = useArticleStoreApi();
    const queryClient = useQueryClient();
    const router = useRouter();

    const saved = useRef<ArticleContentBody | null>(null);
    saved.current ??= buildArticleContent(store.getState());

    const queue = useRef<Promise<unknown>>(Promise.resolve());
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const mounted = useRef(false);

    const meta = MUTATION_META_SKIP_ERROR_TOAST;
    const { mutateAsync: create } = useMutation({
        ...createArticleMutation(),
        meta,
    });
    const { mutateAsync: update } = useMutation({
        ...updateArticleMutation(),
        meta,
    });

    const setSave = store.getState().setSaveState;

    /** Edits only flag `dirty`; this compares against the saved version. */
    const settle = () => {
        clearTimeout(timer.current);
        timer.current = undefined;

        const state = store.getState();
        const dirty = !isEqual(buildArticleContent(state), saved.current);
        // Back at the saved version, a failed save of something else no longer matters.
        const recovered = !dirty && state.save.status === 'error';

        setSave(
            recovered
                ? { dirty, status: 'saved', error: undefined }
                : { dirty },
        );
    };

    const persist = async (draft: boolean) => {
        const state = store.getState();
        const content = buildArticleContent(state);

        setSave({ status: 'saving', error: undefined });

        try {
            const body = { ...content, draft };
            const article = state.slug
                ? await update({ path: { slug: state.slug }, body })
                : await create({ body });

            store.getState().setSaved(article);
            saved.current = content;

            if (!state.slug && mounted.current) {
                // Stay on this route so the editor keeps its state; a reload opens the real one.
                // The router skips a commit to an unchanged location, mask included, so the state differs.
                router.replace('.', {
                    state: (prev) => ({
                        ...prev,
                        [CREATED_ARTICLE_KEY]: article.slug,
                    }),
                    mask: {
                        to: `${articleUrl(article.slug)}/update`,
                        unmaskOnReload: true,
                    },
                    resetScroll: false,
                    ignoreBlocker: true,
                });
            }

            setSave({ status: 'saved' });
            settle();
            invalidateArticles(queryClient);

            return article;
        } catch (error) {
            setSave({
                status: 'error',
                error: apiErrorMessage(error, SAVE_ERROR),
            });
            throw error;
        }
    };

    const enqueue = (draft: boolean) => {
        const run = queue.current
            .catch(() => undefined)
            .then(() => persist(draft));
        queue.current = run;

        return run as Promise<ArticleDocumentResponse>;
    };

    const settleRef = useRef(settle);

    useEffect(() => {
        settleRef.current = settle;
    });

    useEffect(() => {
        mounted.current = true;

        const unsubscribe = store.subscribe((state, prev) => {
            if (state.editorReady && !prev.editorReady) {
                saved.current = buildArticleContent(state);
                return;
            }

            if (
                !ARTICLE_EDITABLE_KEYS.some((key) => state[key] !== prev[key])
            ) {
                return;
            }

            if (!state.save.dirty) setSave({ dirty: true });

            clearTimeout(timer.current);
            timer.current = setTimeout(
                () => settleRef.current(),
                SETTLE_DELAY_MS,
            );
        });

        // The editor reports its normalized value from a child effect, which runs before this one.
        const state = store.getState();
        if (state.editorReady) saved.current = buildArticleContent(state);

        return () => {
            mounted.current = false;
            unsubscribe();
            clearTimeout(timer.current);
        };
    }, [store, setSave]);

    const save = async () => {
        const { draft } = store.getState();

        try {
            await enqueue(draft);
            if (!draft) toast.success('Статтю оновлено.');
        } catch (error) {
            toast.error(apiErrorMessage(error, SAVE_ERROR));
        }
    };

    const saveRef = useRef(save);

    useEffect(() => {
        saveRef.current = save;
    });

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!isSaveShortcut(event) || event.repeat) return;

            event.preventDefault();
            if (!selectSaveDisabled(store.getState())) saveRef.current();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [store]);

    const publish = async () => {
        try {
            const article = await enqueue(false);

            toast.success('Статтю опубліковано.');
            router.push(articleUrl(article.slug), { ignoreBlocker: true });
        } catch (error) {
            toast.error(apiErrorMessage(error, SAVE_ERROR));
        }
    };

    return { save, publish };
}

export type ArticleSave = ReturnType<typeof useArticleSave>;
