'use client';

import { useArticleBySlug } from '@hikka/react';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import {
    ArticleState,
    ArticleStore,
    createArticleStore,
} from '../stores/article-store';

type ArticleProviderProps = React.PropsWithChildren<{
    initialState?: Partial<ArticleState>;
}>;

type ArticleReturnStore = ReturnType<typeof createArticleStore>;

export const ArticleContext = createContext<ArticleReturnStore | null>(null);

export default function ArticleProvider({
    children,
    initialState,
}: ArticleProviderProps) {
    const storeRef = useRef<ArticleReturnStore>(null);

    if (!storeRef.current) {
        storeRef.current = createArticleStore(initialState);
    }

    return (
        <ArticleContext.Provider value={storeRef.current}>
            {children}
        </ArticleContext.Provider>
    );
}

export function useArticleContext<T>(selector: (state: ArticleStore) => T): T {
    const store = useContext(ArticleContext);
    const articleQuery = useArticleBySlug({
        slug: String(store?.getState().slug),
        options: {
            enabled: false,
        },
    });
    if (!store) throw new Error('Missing ArticleContext.Provider in the tree');
    return useStore(store, selector);
}
