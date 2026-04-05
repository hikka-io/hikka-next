'use client';

import { UIEffect } from '@hikka/client';
import { Suspense, lazy } from 'react';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useSettingsStore } from '@/services/stores/settings-store';

const SnowfallEffect = lazy(() => import('./snowfall-effect'));
const SakuraEffect = lazy(() => import('./sakura-effect'));

const EFFECT_COMPONENTS: Record<UIEffect, React.ComponentType> = {
    snowfall: SnowfallEffect,
    sakura: SakuraEffect,
};

const EffectsManager = () => {
    const { activeEffects } = useSessionUI();
    const localEffects = useSettingsStore((s) => s.localEffects);

    const allEffects = [...new Set([...activeEffects, ...localEffects])];

    if (allEffects.length === 0) {
        return null;
    }

    return (
        <Suspense>
            {allEffects.map((effect) => {
                const EffectComponent = EFFECT_COMPONENTS[effect];
                if (!EffectComponent) return null;
                return <EffectComponent key={effect} />;
            })}
        </Suspense>
    );
};

export default EffectsManager;
