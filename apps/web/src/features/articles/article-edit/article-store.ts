import type { Value } from 'platejs';
import { createStore } from 'zustand';

import { ArticleCategoryEnum, type ArticleDocumentResponse } from '@hikka/api';

import type { ArticleContent } from '../types';

export type ArticleState = {
    slug?: string;
    title?: string;
    category: ArticleCategoryEnum;
    document?: Value;
    tags: string[];
    draft: boolean;
    content?: ArticleContent | null;
};

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type ArticleSaveState = {
    status: SaveStatus;
    dirty: boolean;
    error?: string;
};

/** The fields a save sends; edits to any of them make the article dirty. */
export const ARTICLE_EDITABLE_KEYS = [
    'title',
    'category',
    'document',
    'tags',
    'content',
] as const satisfies (keyof ArticleState)[];

type ArticleSession = {
    save: ArticleSaveState;
    /** Set once the editor reports its normalized starting document. */
    editorReady: boolean;
};

export type ArticleActions = {
    setTitle: (title: string) => void;
    setCategory: (category: ArticleCategoryEnum) => void;
    setDocument: (document: Value) => void;
    setTags: (tags: string[]) => void;
    setContent: (content?: ArticleContent | null) => void;
    setEditorDocument: (document: Value) => void;
    setSaved: (
        article: Pick<ArticleDocumentResponse, 'slug' | 'draft'>,
    ) => void;
    setSaveState: (save: Partial<ArticleSaveState>) => void;
};

export type ArticleStore = ArticleState & ArticleSession & ArticleActions;

const DEFAULT_STATE: ArticleState = {
    category: ArticleCategoryEnum.NEWS,
    tags: [],
    draft: true,
};

export function articleToState(article: ArticleDocumentResponse): ArticleState {
    return {
        slug: article.slug,
        title: article.title,
        category: article.category as ArticleCategoryEnum,
        document: article.document as Value,
        tags: article.tags.map((tag) => tag.name),
        draft: article.draft,
        content: article.content,
    };
}

export const createArticleStore = (initialState?: Partial<ArticleState>) =>
    createStore<ArticleStore>()((set) => ({
        ...DEFAULT_STATE,
        ...initialState,
        save: { status: 'idle', dirty: false },
        editorReady: false,
        setTitle: (title) => set({ title }),
        setCategory: (category) => set({ category }),
        setDocument: (document) => set({ document }),
        setTags: (tags) => set({ tags }),
        setContent: (content) => set({ content }),
        setEditorDocument: (document) => set({ document, editorReady: true }),
        // Only identity and status: the editable fields may have moved on while the request was in flight.
        setSaved: ({ slug, draft }) => set({ slug, draft }),
        setSaveState: (save) =>
            set((state) => ({ save: { ...state.save, ...save } })),
    }));
