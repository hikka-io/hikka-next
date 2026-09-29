import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { EFFECT_IDS, EFFECTS } from '@/features/effects';
import type { UIEffect } from '@/utils/customization';

const EffectsSettings = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const handleToggleEffect = (value: UIEffect) => {
        const isActive = preferences.effect === value;
        update({ preferences: { effect: isActive ? null : value } });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {EFFECT_IDS.map((value) => (
                <div
                    key={value}
                    className="flex w-full flex-row items-center justify-between gap-2"
                >
                    <div className="flex flex-col">
                        <Label>{EFFECTS[value].label}</Label>
                        <small className="text-muted-foreground">
                            {EFFECTS[value].description}
                        </small>
                    </div>
                    <Switch
                        checked={preferences.effect === value}
                        onCheckedChange={() => handleToggleEffect(value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default EffectsSettings;
