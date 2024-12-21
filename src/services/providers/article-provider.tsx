'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import {
    ArticleState,
    ArticleStore,
    createArticleStore,
} from '../stores/article-store';

type ArticleProviderProps = React.PropsWithChildren<{
    initialState?: ArticleState;
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
    if (!store) throw new Error('Missing ArticleContext.Provider in the tree');
    return useStore(store, selector);
}
