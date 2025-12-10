'use client';

import { FC, PropsWithChildren, useEffect } from 'react';

import { useUIStore } from '@/services/stores/ui-store';
import { applyStyles } from '@/utils/inject-styles';

const UIStylesProvider: FC<PropsWithChildren> = ({ children }) => {
    const hasHydrated = useUIStore((state) => state._hasHydrated);

    useEffect(() => {
        if (!hasHydrated) return;

        const styles = useUIStore.getState().getMergedStyles();
        applyStyles(styles);
    }, [hasHydrated]);

    useEffect(() => {
        if (!hasHydrated) return;

        const unsubscribe = useUIStore.subscribe((state, prevState) => {
            if (state.appearance !== prevState.appearance) {
                const styles = state.getMergedStyles();
                applyStyles(styles);
            }
        });

        return unsubscribe;
    }, [hasHydrated]);

    return <>{children}</>;
};

export default UIStylesProvider;
