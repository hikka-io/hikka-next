'use client';

import { useMemo } from 'react';

import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useUIStore } from '@/services/stores/ui-store';
import { mergeEffects } from '@/utils/appearance';
import { getActiveEventTheme } from '@/utils/constants/event-themes';

const EffectsSettings = () => {
    const userEffects = useUIStore((state) => state.effects);
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
            <div className="border-t border-border pt-6">
                <Button variant="destructive" size="md" onClick={reset}>
                    Скинути всі налаштування
                </Button>
            </div>
        </div>
    );
};

export default EffectsSettings;
