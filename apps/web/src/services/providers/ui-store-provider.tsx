'use client';

import { UserAppearance } from '@hikka/client';
import { PropsWithChildren, createContext, useContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';

import { UIStore, createUIStore } from '@/services/stores/ui-store';

const UIStoreContext = createContext<StoreApi<UIStore> | null>(null);

export function UIStoreProvider({
    children,
    initialUIData,
}: PropsWithChildren<{ initialUIData: UserAppearance }>) {
    const storeRef = useRef<StoreApi<UIStore> | null>(null);

    if (!storeRef.current) {
        storeRef.current = createUIStore(initialUIData);
    }

    return (
        <UIStoreContext.Provider value={storeRef.current}>
            {children}
        </UIStoreContext.Provider>
    );
}

export function useUIStoreApi(): StoreApi<UIStore> {
    const store = useContext(UIStoreContext);
    if (!store) {
        throw new Error('useUIStoreApi must be used within UIStoreProvider');
    }
    return store;
}

export function useUIStore<T>(selector: (state: UIStore) => T): T {
    return useStore(useUIStoreApi(), selector);
}
