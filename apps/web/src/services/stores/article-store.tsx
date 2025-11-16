'use client';

import {
    ArticleAnimeContentResponse,
    ArticleCategoryEnum,
    ArticleMangaNovelContentResponse,
    ArticleResponse,
} from '@hikka/client';
import { Value } from 'platejs';
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
    getDocument: () => Value | undefined;
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
    };
    return createStore<ArticleStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setArticle: (article: ArticleResponse) => {
            set({
                ...article,
                document: article.document,
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
        getDocument: () => get().document
    }));
};
