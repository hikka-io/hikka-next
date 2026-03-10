'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import {
    CollectionState,
    CollectionStore,
    createCollectionStore,
} from '../stores/collection-store';

type CollectionProviderProps = React.PropsWithChildren<{
    initialState?: Partial<CollectionState>;
}>;

type CollectionReturnStore = ReturnType<typeof createCollectionStore>;

export const CollectionContext = createContext<CollectionReturnStore | null>(
    null,
);

export default function CollectionProvider({
    children,
    initialState,
}: CollectionProviderProps) {
    const storeRef = useRef<CollectionReturnStore>(null);

    if (!storeRef.current) {
        storeRef.current = createCollectionStore(initialState);
    }

    return (
        <CollectionContext.Provider value={storeRef.current}>
            {children}
        </CollectionContext.Provider>
    );
}

export function useCollectionContext<T>(
    selector: (state: CollectionStore) => T,
): T {
    const store = useContext(CollectionContext);
    if (!store)
        throw new Error('Missing CollectionContext.Provider in the tree');
    return useStore(store, selector);
}
