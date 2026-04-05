'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useSettingsStore } from '@/services/stores/settings-store';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';

const EffectsSettings = () => {
    const { activeEffects, preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();
    const { localEffects, toggleLocalEffect } = useSettingsStore();

    const handleChangeSnowflakes = () => {
        const currentEffects = preferences.effects ?? [];
        const hasEffect = currentEffects.includes('snowfall');
        const effects = hasEffect
            ? currentEffects.filter((e) => e !== 'snowfall')
            : [...currentEffects, 'snowfall' as const];
        update({ preferences: { effects } });
    };

    const handleChangeSakura = () => {
        toggleLocalEffect('sakura');
    };

    const hasSnowfall = activeEffects.includes('snowfall');
    const hasSakura = localEffects.includes('sakura');

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="flex flex-col">
                    <Label>Сніжинки ❄️</Label>
                    <small className="text-muted-foreground">
                        Включити анімацію сніжинок на сайті
                    </small>
                </div>
                <Switch
                    checked={hasSnowfall}
                    onCheckedChange={handleChangeSnowflakes}
                />
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="flex flex-col">
                    <Label>Сакура 🌸</Label>
                    <small className="text-muted-foreground">
                        Включити анімацію пелюсток сакури на сайті
                    </small>
                </div>
                <Switch
                    checked={hasSakura}
                    onCheckedChange={handleChangeSakura}
                />
            </div>
        </div>
    );
};

export default EffectsSettings;
