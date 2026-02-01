'use client';

import { UserUI } from '@hikka/client';
import { PropsWithChildren, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import {
    UIStore,
    UIStoreWithTemporal,
    UITemporalState,
    createUIStore,
} from '@/services/stores/ui-store';

const UIStoreContext = createContext<UIStoreWithTemporal | null>(null);

export function UIStoreProvider({
    children,
    initialUI,
}: PropsWithChildren<{ initialUI: UserUI }>) {
    const storeRef = useRef<UIStoreWithTemporal | null>(null);

    if (!storeRef.current) {
        storeRef.current = createUIStore(initialUI);

        storeRef.current.temporal.getState().pause();
    }

    return (
        <UIStoreContext.Provider value={storeRef.current}>
            {children}
        </UIStoreContext.Provider>
    );
}

export function useUIStoreApi(): UIStoreWithTemporal {
    const store = useContext(UIStoreContext);
    if (!store) {
        throw new Error('useUIStoreApi must be used within UIStoreProvider');
    }
    return store;
}

export function useUIStore<T>(selector: (state: UIStore) => T): T {
    return useStore(useUIStoreApi(), selector);
}

export function useUITemporalStore<T>(
    selector: (state: UITemporalState) => T,
    equality?: (a: T, b: T) => boolean,
): T {
    const store = useUIStoreApi();
    return useStoreWithEqualityFn(store.temporal, selector, equality);
}

export function useUIStoreHistory() {
    const undo = useUITemporalStore((state) => state.undo);
    const redo = useUITemporalStore((state) => state.redo);
    const clear = useUITemporalStore((state) => state.clear);
    const pause = useUITemporalStore((state) => state.pause);
    const resume = useUITemporalStore((state) => state.resume);
    const isTracking = useUITemporalStore((state) => state.isTracking);
    const pastStates = useUITemporalStore((state) => state.pastStates);
    const futureStates = useUITemporalStore((state) => state.futureStates);

    return {
        undo,
        redo,
        clear,
        pause,
        resume,
        isTracking,
        canUndo: pastStates.length > 0,
        canRedo: futureStates.length > 0,
        historyLength: pastStates.length,
    };
}
