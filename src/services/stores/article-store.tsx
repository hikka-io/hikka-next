'use client';

import { createStore } from 'zustand';

export type ArticleState = {
    slug?: string;
    title?: string;
    category?: API.ArticleCategory;
    text?: string;
    tags: string[];
    draft?: boolean;
};

export type ArticleActions = {
    setArticle: (article: API.Article) => void;
    setTitle: (title: string) => void;
    setCategory: (category: API.ArticleCategory) => void;
    setText: (text: string) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    getText: () => string | undefined;
};

export type ArticleStore = ArticleState & ArticleActions;

export const createArticleStore = (initProps?: ArticleState) => {
    const DEFAULT_PROPS: ArticleState = {
        title: undefined,
        category: 'news',
        text: undefined,
        tags: [],
        draft: true,
    };
    return createStore<ArticleStore>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setArticle: (article: API.Article) => {
            set({
                ...article,
            });
        },
        setTitle: (title: string) => set({ title }),
        setCategory: (category: API.ArticleCategory) => set({ category }),
        setText: (text: string) => set({ text }),
        setTags: (tags: string[]) => set({ tags }),
        setDraft: (draft: boolean) => set({ draft }),
        getText: () => get().text,
    }));
};
