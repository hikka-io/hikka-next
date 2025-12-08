'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useUIStore } from '@/services/stores/ui-store';

const COLOR_PRESETS = [
    { name: 'Рожевий', hue: 321, color: '#e779c1' },
    { name: 'Синій', hue: 217, color: '#6390e8' },
    { name: 'Зелений', hue: 142, color: '#63e88a' },
    { name: 'Помаранчевий', hue: 25, color: '#e8a063' },
    { name: 'Фіолетовий', hue: 270, color: '#a063e8' },
    { name: 'Червоний', hue: 0, color: '#e86363' },
    { name: 'Бірюзовий', hue: 180, color: '#63e8e8' },
];

const Component = () => {
    const appearance = useUIStore((state) => state.appearance);

    const setColorToken = useUIStore((state) => state.setColorToken);
    const setRadius = useUIStore((state) => state.setRadius);

    const handleAccentColorChange = (hue: number) => {
        setColorToken('light', 'primary', `${hue} 100% 95%`);
        setColorToken('light', 'primaryForeground', `${hue} 70% 45%`);
        setColorToken('light', 'primaryBorder', `${hue} 90% 90%`);

        setColorToken('dark', 'primary', `${hue} 10% 5%`);
        setColorToken('dark', 'primaryForeground', `${hue} 70% 69%`);
        setColorToken('dark', 'primaryBorder', `${hue} 43% 17%`);
    };

    const handleRadiusChange = (value: string) => {
        setRadius(value ? `${value}rem` : undefined);
    };

    const currentRadius = appearance.styles?.radius?.replace('rem', '') ?? '';

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Палітра кольорів</Label>
                <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset) => (
                        <button
                            key={preset.hue}
                            onClick={() => handleAccentColorChange(preset.hue)}
                            className="size-8 rounded-md border border-border transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label>Радіус заокруглення</Label>
                <div className="flex gap-2">
                    <Button
                        variant={currentRadius === '0' ? 'default' : 'outline'}
                        onClick={() => handleRadiusChange('0')}
                        size="badge"
                    >
                        Без заокруглення
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.25' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.25')}
                        size="badge"
                    >
                        XS
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.5' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.5')}
                        size="badge"
                    >
                        SM
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.625' || !currentRadius
                                ? 'default'
                                : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.625')}
                        size="badge"
                    >
                        MD
                    </Button>
                    <Button
                        variant={
                            currentRadius === '0.75' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('0.75')}
                        size="badge"
                    >
                        LG
                    </Button>
                    <Button
                        variant={
                            currentRadius === '1.5' ? 'default' : 'outline'
                        }
                        onClick={() => handleRadiusChange('1.5')}
                        size="badge"
                    >
                        XL
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Component;
