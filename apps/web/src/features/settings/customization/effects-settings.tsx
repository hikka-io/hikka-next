import type { UiPreferencesOutput } from '@hikka/api';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';

type UIEffect = NonNullable<UiPreferencesOutput['effect']>;

const EFFECTS: { value: UIEffect; label: string; description: string }[] = [
    {
        value: 'snowfall',
        label: 'Сніжинки ❄️',
        description: 'Включити анімацію сніжинок на сайті',
    },
    {
        value: 'sakura',
        label: 'Сакура 🌸',
        description: 'Включити анімацію пелюсток сакури на сайті',
    },
];

const EffectsSettings = () => {
    const { preferences } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const handleToggleEffect = (value: UIEffect) => {
        const isActive = preferences.effect === value;
        update({ preferences: { effect: isActive ? null : value } });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {EFFECTS.map(({ value, label, description }) => (
                <div
                    key={value}
                    className="flex w-full flex-row items-center justify-between gap-2"
                >
                    <div className="flex flex-col">
                        <Label>{label}</Label>
                        <small className="text-muted-foreground">
                            {description}
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
