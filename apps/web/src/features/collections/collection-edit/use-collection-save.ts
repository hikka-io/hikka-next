import { useEffect, useRef } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { toast } from 'sonner';

import {
    type CollectionArgs,
    ContentTypeEnum,
    createCollectionMutation,
    updateCollectionMutation,
} from '@hikka/api';
import {
    apiErrorMessage,
    contentPath,
    MUTATION_META_SKIP_ERROR_TOAST,
} from '@hikka/core';

import type { SaveTone } from '@/components/save-indicator';
import { useSaveShortcut } from '@/services/hooks/use-save-shortcut';
import { invalidateCollections } from '@/utils/api/invalidate-content-state';
import { useRouter } from '@/utils/navigation';

import { useCollectionStore } from './collection-provider';
import { canSaveCollection } from './collection-rules';
import {
    COLLECTION_EDITABLE_KEYS,
    type CollectionStore,
} from './collection-store';

/** Quiet time before an edit is compared with the saved version; undoing back to it clears `dirty`. */
const SETTLE_DELAY_MS = 500;

const SAVE_ERROR = 'Не вдалося зберегти колекцію.';

const collectionUrl = (reference: string) =>
    contentPath(ContentTypeEnum.COLLECTION, reference);

export const selectUnsavedBlocking = (state: CollectionStore) =>
    state.save.dirty;

export const selectSaveDisabled = (state: CollectionStore) =>
    state.save.status === 'saving' ||
    !canSaveCollection(state) ||
    (state.reference !== undefined && !state.save.dirty);

export const selectPreviewUrl = (state: CollectionStore) =>
    state.reference ? collectionUrl(state.reference) : undefined;

export function describeSave({
    save,
    reference,
}: Pick<CollectionStore, 'save' | 'reference'>): {
    tone: SaveTone;
    label: string;
} {
    if (save.status === 'saving') return { tone: 'saving', label: 'Зберігаю…' };
    if (save.status === 'error') {
        return { tone: 'error', label: 'Не вдалося зберегти' };
    }
    if (save.dirty) return { tone: 'unsaved', label: 'Незбережені зміни' };

    return reference
        ? { tone: 'saved', label: 'Збережено' }
        : { tone: 'draft', label: 'Нова колекція' };
}

/**
 * Saves only on request. A new collection is created once and the editor
 * moves to its update page; an existing one stays open after each update.
 * Status lives in the store's `save` field.
 */
export function useCollectionSave() {
    const store = useCollectionStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    const saved = useRef<CollectionArgs | null>(null);
    saved.current ??= store.getState().getApiData();

    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const mounted = useRef(false);

    const meta = MUTATION_META_SKIP_ERROR_TOAST;
    const { mutateAsync: create } = useMutation({
        ...createCollectionMutation(),
        meta,
    });
    const { mutateAsync: update } = useMutation({
        ...updateCollectionMutation(),
        meta,
    });

    const setSave = store.getState().setSaveState;

    /** Edits only flag `dirty`; this compares against the saved version. */
    const settle = () => {
        clearTimeout(timer.current);
        timer.current = undefined;

        const state = store.getState();
        const dirty = !isEqual(state.getApiData(), saved.current);
        // Back at the saved version, a failed save of something else no longer matters.
        const recovered = !dirty && state.save.status === 'error';

        setSave(
            recovered
                ? { dirty, status: 'saved', error: undefined }
                : { dirty },
        );
    };

    const settleRef = useRef(settle);

    useEffect(() => {
        settleRef.current = settle;
    });

    useEffect(() => {
        mounted.current = true;

        const unsubscribe = store.subscribe((state, prev) => {
            if (
                !COLLECTION_EDITABLE_KEYS.some(
                    (key) => state[key] !== prev[key],
                )
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

        return () => {
            mounted.current = false;
            unsubscribe();
            clearTimeout(timer.current);
        };
    }, [store, setSave]);

    const persist = async () => {
        const { reference, getApiData } = store.getState();
        const body = getApiData();

        setSave({ status: 'saving', error: undefined });

        try {
            if (reference) {
                const collection = await update({ path: { reference }, body });
                const applied = store.getState().applySaved(body, collection);

                saved.current = applied ? store.getState().getApiData() : body;
                setSave({ status: 'saved' });
                settle();
                invalidateCollections(queryClient);
                toast.success('Колекцію оновлено.');
                return;
            }

            const collection = await create({ body });

            saved.current = body;
            setSave({ status: 'saved', dirty: false });
            invalidateCollections(queryClient);
            toast.success('Колекцію створено.');

            if (mounted.current) {
                router.replace(
                    `${collectionUrl(collection.reference)}/update`,
                    {
                        ignoreBlocker: true,
                    },
                );
            }
        } catch (error) {
            setSave({
                status: 'error',
                error: apiErrorMessage(error, SAVE_ERROR),
            });
            throw error;
        }
    };

    const save = async () => {
        if (selectSaveDisabled(store.getState())) return;

        try {
            await persist();
        } catch (error) {
            toast.error(apiErrorMessage(error, SAVE_ERROR));
        }
    };

    useSaveShortcut(save);

    return { save };
}

export type CollectionSave = ReturnType<typeof useCollectionSave>;
