'use client';

import { Value } from '@udecode/plate-common';
import { createStore } from 'zustand';

export type ArticleState = {
    slug?: string;
    title?: string;
    category?: API.ArticleCategory;
    document?: Value;
    tags: string[];
    draft?: boolean;
    content?:
        | API.MainContent
        | {
              data_type: API.ContentType;
              title_ua?: string;
              title_en?: string;
              title_ja?: string;
              slug: string;
              image: string;
          };
    cover?: string;
};

export type ArticleActions = {
    setArticle: (article: API.Article) => void;
    setTitle: (title: string) => void;
    setCategory: (category: API.ArticleCategory) => void;
    setDocument: (text: Value) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    setContent: (content?: API.MainContent) => void;
    setCover: (cover: string) => void;
    getDocument: () => Value | undefined;
};

export type ArticleStore = ArticleState & ArticleActions;

export const createArticleStore = (initProps?: Partial<ArticleState>) => {
    const DEFAULT_PROPS: ArticleState = {
        title: undefined,
        category: 'news',
        document: undefined,
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
                tags: article.tags.map((tag) => tag.name),
            });
        },
        setTitle: (title: string) => set({ title }),
        setCategory: (category: API.ArticleCategory) => set({ category }),
        setDocument: (document: Value) => set({ document }),
        setTags: (tags: string[]) => set({ tags }),
        setDraft: (draft: boolean) => set({ draft }),
        setContent: (content?: API.MainContent) => set({ content }),
        setCover: (cover: string) => set({ cover }),
        getDocument: () => get().document,
    }));
};
