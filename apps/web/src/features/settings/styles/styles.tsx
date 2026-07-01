import { useEffect, useState } from 'react';

import { RotateCcw } from 'lucide-react';

import type { OklchColor } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { ACCENT_PRESETS } from '@/utils/constants/styles';
import { DEFAULT_STYLES } from '@/utils/ui';
import { oklchEqual, oklchToCss } from '@/utils/ui/color';

import BrandColorPicker from './components/brand-color-picker';

const DEFAULT_BRAND: OklchColor = DEFAULT_STYLES.brand ?? {
    l: 0.7,
    c: 0.18,
    h: 343,
};

const RADIUS_OPTIONS: { value: string; label: string }[] = [
    { value: '0', label: 'Без' },
    { value: '0.25', label: 'XS' },
    { value: '0.5', label: 'SM' },
    { value: '0.625', label: 'MD' },
    { value: '0.75', label: 'LG' },
    { value: '1.5', label: 'XL' },
];

const setLiveVar = (name: string, value: string | null) => {
    if (value === null) document.documentElement.style.removeProperty(name);
    else document.documentElement.style.setProperty(name, value);
};

const StylesSettings = () => {
    const { styles, backdrop } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const brand = styles.brand ?? DEFAULT_BRAND;
    const isCustomBrand = !ACCENT_PRESETS.some((p) =>
        oklchEqual(brand, p.brand),
    );
    const currentRadius = styles.radius?.replace('rem', '') ?? '0.625';

    // Local slider state so the thumb tracks during drag; the query only
    // updates on commit.
    const [intensity, setIntensity] = useState(backdrop.intensity);
    useEffect(() => setIntensity(backdrop.intensity), [backdrop.intensity]);

    const commitBrand = (next: OklchColor) => {
        setLiveVar('--brand', null);
        update({ styles: { ...styles, brand: next } });
    };

    const setRadius = (value: string) => {
        update({
            styles: { ...styles, radius: value ? `${value}rem` : undefined },
        });
    };

    const setBackdropStyle = (style: 'none' | 'glow') => {
        update({ styles: { ...styles, backdrop: { style, intensity } } });
    };

    const commitIntensity = (value: number) => {
        update({
            styles: {
                ...styles,
                backdrop: { style: backdrop.style, intensity: value },
            },
        });
    };

    const resetToDefaults = () => {
        setLiveVar('--brand', null);
        setLiveVar('--backdrop-intensity', null);
        update({
            styles: {
                ...styles,
                brand: DEFAULT_STYLES.brand,
                radius: DEFAULT_STYLES.radius,
                backdrop: DEFAULT_STYLES.backdrop,
                overrides: undefined,
            },
        });
    };

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Основний колір</Label>
                <div className="flex flex-wrap items-center gap-2">
                    {ACCENT_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            type="button"
                            title={preset.name}
                            aria-label={preset.name}
                            onClick={() => commitBrand(preset.brand)}
                            data-active={oklchEqual(brand, preset.brand)}
                            className="size-9 rounded-md border data-[active=true]:ring-2 data-[active=true]:ring-ring data-[active=true]:ring-offset-1"
                            style={{
                                backgroundColor: oklchToCss(preset.brand),
                            }}
                        />
                    ))}
                    <BrandColorPicker
                        value={brand}
                        active={isCustomBrand}
                        onPreview={(next) =>
                            setLiveVar('--brand', oklchToCss(next))
                        }
                        onCommit={commitBrand}
                    />
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Радіус заокруглення</Label>
                <div className="flex flex-wrap gap-2">
                    {RADIUS_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            variant={
                                currentRadius === option.value
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => setRadius(option.value)}
                            size="badge"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Фон</Label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={
                            backdrop.style === 'glow' ? 'default' : 'outline'
                        }
                        onClick={() => setBackdropStyle('glow')}
                        size="badge"
                    >
                        Сяйво
                    </Button>
                    <Button
                        variant={
                            backdrop.style === 'none' ? 'default' : 'outline'
                        }
                        onClick={() => setBackdropStyle('none')}
                        size="badge"
                    >
                        Вимкнено
                    </Button>
                </div>
                {backdrop.style === 'glow' && (
                    <Slider
                        className="mt-2 max-w-xs"
                        min={0}
                        max={1}
                        step={0.05}
                        value={[intensity]}
                        showValue="on-interaction"
                        formatValue={(value) => `${Math.round(value * 100)}%`}
                        onValueChange={([value]) => {
                            setIntensity(value);
                            setLiveVar('--backdrop-intensity', String(value));
                        }}
                        onValueCommit={([value]) => commitIntensity(value)}
                    />
                )}
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Попередній перегляд</Label>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-secondary/20 p-4">
                    <Button size="sm">Кнопка</Button>
                    <Button size="sm" variant="destructive">
                        Видалити
                    </Button>
                    <Button size="sm" variant="outline">
                        Контур
                    </Button>
                    <Badge>Основний</Badge>
                    <Badge variant="success">Успіх</Badge>
                    <Badge variant="warning">Увага</Badge>
                    <Badge variant="destructive">Помилка</Badge>
                </div>
            </div>

            <div>
                <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                    <RotateCcw className="size-4" />
                    Скинути до типових
                </Button>
            </div>
        </div>
    );
};

export default StylesSettings;
