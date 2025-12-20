'use client';

import { useMemo } from 'react';

import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useUIStore } from '@/services/providers/ui-store-provider';
import { mergeEffects } from '@/utils/appearance';
import { getActiveEventTheme } from '@/utils/constants/event-themes';

const EffectsSettings = () => {
    const userEffects = useUIStore((state) => state.preferences?.effects);
    const toggleEffect = useUIStore((state) => state.toggleEffect);
    const reset = useUIStore((state) => state.reset);

    const handleChangeSnowflakes = () => {
        toggleEffect('snowfall');
    };

    const activeEffects = useMemo(() => {
        const eventTheme = getActiveEventTheme();
        return mergeEffects(eventTheme?.effects, userEffects);
    }, [userEffects]);

    const hasSnowfall = activeEffects.includes('snowfall');

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="flex flex-col">
                    <Label>Сніжинки ❄️</Label>
                    <Small className="text-muted-foreground">
                        Включити анімацію сніжинок на сайті
                    </Small>
                </div>
                <Switch
                    checked={hasSnowfall}
                    onCheckedChange={handleChangeSnowflakes}
                />
            </div>
        </div>
    );
};

export default EffectsSettings;
