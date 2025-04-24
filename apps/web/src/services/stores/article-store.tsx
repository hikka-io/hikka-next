'use client';

import {
    ArticleAnimeContentResponse,
    ArticleCategoryEnum,
    ArticleMangaNovelContentResponse,
    ArticleResponse,
} from '@hikka/client';
import { Value } from '@udecode/plate';
import { createStore } from 'zustand';

export type ArticleState = {
    slug?: string;
    title?: string;
    category?: ArticleCategoryEnum;
    document?: Value;
    tags: string[];
    draft?: boolean;
    content?:
        | ArticleAnimeContentResponse
        | ArticleMangaNovelContentResponse
        | null;
    preview?: Value;
};

export type ArticleActions = {
    setArticle: (article: ArticleResponse) => void;
    setTitle: (title: string) => void;
    setCategory: (category: ArticleCategoryEnum) => void;
    setDocument: (text: Value) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    setContent: (
        content?:
            | ArticleAnimeContentResponse
            | ArticleMangaNovelContentResponse
            | null,
    ) => void;
    setPreview: (preview: Value) => void;
    getDocument: () => Value | undefined;
    getPreview: () => Value | undefined;
};

export type ArticleStore = ArticleState & ArticleActions;

export const createArticleStore = (initProps?: Partial<ArticleState>) => {
    const DEFAULT_PROPS: ArticleState = {
        title: undefined,
        category: ArticleCategoryEnum.NEWS,
        document: undefined,
        tags: [],
        draft: true,
        content: undefined,
        preview: undefined,
    };
    return createStore<ArticleStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setArticle: (article: ArticleResponse) => {
            set({
                ...article,
                tags: article.tags.map((tag) => tag.name),
            });
        },
        setTitle: (title: string) => set({ title }),
        setCategory: (category: ArticleCategoryEnum) => set({ category }),
        setDocument: (document: Value) => set({ document }),
        setTags: (tags: string[]) => set({ tags }),
        setDraft: (draft: boolean) => set({ draft }),
        setContent: (
            content?:
                | ArticleAnimeContentResponse
                | ArticleMangaNovelContentResponse
                | null,
        ) => set({ content }),
        setPreview: (preview: Value) => set({ preview }),
        getDocument: () => get().document,
        getPreview: () => get().preview,
    }));
};
