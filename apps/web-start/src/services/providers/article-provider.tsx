import { createContext, useContext, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';

import { getArticleOptions } from '@hikka/api';

import {
    type ArticleState,
    type ArticleStore,
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
    const _articleQuery = useQuery({
        ...getArticleOptions({
            path: { slug: String(store?.getState().slug) },
        }),
        enabled: false,
    });
    if (!store) throw new Error('Missing ArticleContext.Provider in the tree');
    return useStore(store, selector);
}
