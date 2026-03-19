'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/services/hooks/use-update-session-ui';

const EffectsSettings = () => {
    const { activeEffects, preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const handleChangeSnowflakes = () => {
        const currentEffects = preferences.effects ?? [];
        const hasEffect = currentEffects.includes('snowfall');
        const effects = hasEffect
            ? currentEffects.filter((e) => e !== 'snowfall')
            : [...currentEffects, 'snowfall' as const];
        update({ preferences: { effects } });
    };

    const hasSnowfall = activeEffects.includes('snowfall');

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
        </div>
    );
};

export default EffectsSettings;
