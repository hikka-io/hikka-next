'use client';

import { UIEffect } from '@hikka/client';
import { Suspense, lazy, useMemo } from 'react';

import { useUIStore } from '@/services/providers/ui-store-provider';
import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { mergeEffects } from '@/utils/ui';

const SnowfallEffect = lazy(() => import('./snowfall-effect'));

const EFFECT_COMPONENTS: Record<UIEffect, React.ComponentType> = {
    snowfall: SnowfallEffect,
};

const EffectsManager = () => {
    const userEffects = useUIStore((state) => state.preferences?.effects);
    const hasHydrated = useUIStore((state) => state._hasHydrated);

    const activeEffects = useMemo(() => {
        const eventTheme = getActiveEventTheme();
        return mergeEffects(eventTheme?.effects, userEffects);
    }, [userEffects]);

    if (!hasHydrated || activeEffects.length === 0) {
        return null;
    }

    return (
        <Suspense>
            {activeEffects.map((effect) => {
                const EffectComponent = EFFECT_COMPONENTS[effect];
                if (!EffectComponent) return null;
                return <EffectComponent key={effect} />;
            })}
        </Suspense>
    );
};

export default EffectsManager;
