'use client';

import { createStore } from 'zustand';

export type ArticleState = {
    slug?: string;
    title?: string;
    category?: API.ArticleCategory;
    text?: string;
    tags: string[];
    draft?: boolean;
    content?: API.MainContent;
    cover?: string;
};

export type ArticleActions = {
    setArticle: (article: API.Article) => void;
    setTitle: (title: string) => void;
    setCategory: (category: API.ArticleCategory) => void;
    setText: (text: string) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    setContent: (content?: API.MainContent) => void;
    setCover: (cover: string) => void;
    getText: () => string | undefined;
};

export type ArticleStore = ArticleState & ArticleActions;

export const createArticleStore = (initProps?: Partial<ArticleState>) => {
    const DEFAULT_PROPS: ArticleState = {
        title: undefined,
        category: 'news',
        text: undefined,
        tags: [],
        draft: true,
        content: undefined,
        cover: undefined,
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
        setContent: (content?: API.MainContent) => set({ content }),
        setCover: (cover: string) => set({ cover }),
        getText: () => get().text,
    }));
};
