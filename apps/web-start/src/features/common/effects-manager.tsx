'use client';

import { UIEffect } from '@hikka/client';
import { Suspense, lazy } from 'react';

import { useSessionUI } from '@/services/hooks/use-session-ui';

const SnowfallEffect = lazy(() => import('./snowfall-effect'));

const EFFECT_COMPONENTS: Record<UIEffect, React.ComponentType> = {
    snowfall: SnowfallEffect,
};

const EffectsManager = () => {
    const { activeEffects } = useSessionUI();

    if (activeEffects.length === 0) {
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
