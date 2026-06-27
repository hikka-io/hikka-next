import { lazy, Suspense } from 'react';

import type { UiPreferencesOutput } from '@hikka/api';

import { useSessionUI } from '@/services/hooks/use-session-ui';

type UIEffect = NonNullable<UiPreferencesOutput['effect']>;

const SnowfallEffect = lazy(() => import('./snowfall-effect'));
const SakuraEffect = lazy(() => import('./sakura'));

const EFFECT_COMPONENTS: Record<UIEffect, React.ComponentType> = {
    snowfall: SnowfallEffect,
    sakura: SakuraEffect,
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
