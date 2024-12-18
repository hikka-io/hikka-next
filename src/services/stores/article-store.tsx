'use client';

import { create } from 'zustand';

export type ArticleState = {
    title?: string;
    category?: API.ArticleCategory;
    text?: string;
    tags: string[];
    draft?: boolean;
};

export type ArticleActions = {
    setTitle: (title: string) => void;
    setCategory: (category: API.ArticleCategory) => void;
    setText: (text: string) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    getText: () => string | undefined;
};

type ArticleStore = ArticleState & ArticleActions;

export const useArticleStore = create<ArticleStore>()((set, get) => ({
    title: undefined,
    category: 'news',
    text: undefined,
    tags: [],
    draft: true,
    setTitle: (title: string) => set({ title }),
    setCategory: (category: API.ArticleCategory) => set({ category }),
    setText: (text: string) => set({ text }),
    setTags: (tags: string[]) => set({ tags }),
    setDraft: (draft: boolean) => set({ draft }),
    getText: () => get().text,
}));
