'use client';

import { useMemo } from 'react';
import Snowfall from 'react-snowfall';

import { useUIStore } from '@/services/stores/ui-store';
import { mergeEffects } from '@/utils/appearance';
import { getActiveEventTheme } from '@/utils/constants/event-themes';

const SnowfallEffect = () => {
    return (
        <Snowfall
            snowflakeCount={100}
            speed={[0.5, 1.5]}
            wind={[-0.5, 1]}
            style={{
                height: '100lvh',
                maskImage:
                    'linear-gradient(to bottom, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0))',
            }}
        />
    );
};

const EFFECT_COMPONENTS: Record<Hikka.UIEffect, React.ComponentType> = {
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
        <>
            {activeEffects.map((effect) => {
                const EffectComponent = EFFECT_COMPONENTS[effect];
                if (!EffectComponent) return null;
                return <EffectComponent key={effect} />;
            })}
        </>
    );
};

export default EffectsManager;
