'use client';

import { Value } from '@udecode/plate';
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
    preview?: Value;
};

export type ArticleActions = {
    setArticle: (article: API.Article) => void;
    setTitle: (title: string) => void;
    setCategory: (category: API.ArticleCategory) => void;
    setDocument: (text: Value) => void;
    setTags: (tags: string[]) => void;
    setDraft: (draft: boolean) => void;
    setContent: (content?: API.MainContent) => void;
    setPreview: (preview: Value) => void;
    getDocument: () => Value | undefined;
    getPreview: () => Value | undefined;
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
        preview: undefined,
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
        setPreview: (preview: Value) => set({ preview }),
        getDocument: () => get().document,
        getPreview: () => get().preview,
    }));
};
