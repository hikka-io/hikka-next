import { type ReactNode, useEffect, useState } from 'react';

import { Check } from 'lucide-react';

import type { OklchColor } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { ACCENT_PRESETS } from '@/utils/constants/styles';
import { DEFAULT_BRAND, setLiveVar } from '@/utils/ui';
import { oklchEqual, oklchToCss, oklchToHex } from '@/utils/ui/color';

import BrandColorPicker from './components/brand-color-picker';
import Swatch from './components/swatch';

const RADIUS_OPTIONS: { value: string; label: string }[] = [
    { value: '0', label: 'Без' },
    { value: '0.25', label: 'XS' },
    { value: '0.5', label: 'SM' },
    { value: '0.625', label: 'MD' },
    { value: '0.75', label: 'LG' },
    { value: '1.5', label: 'XL' },
];

const Field = ({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
            <Label>{title}</Label>
            <span className="text-muted-foreground text-xs">{description}</span>
        </div>
        {children}
    </div>
);

const StylesSettings = () => {
    const { styles, backdrop } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const brand = styles.brand ?? DEFAULT_BRAND;
    const activePreset = ACCENT_PRESETS.find((p) => oklchEqual(brand, p.brand));
    const currentRadius = styles.radius?.replace('rem', '') ?? '0.625';

    // Local slider state so the thumb tracks during drag; the query only
    // updates on commit.
    const [intensity, setIntensity] = useState(backdrop.intensity);
    useEffect(() => setIntensity(backdrop.intensity), [backdrop.intensity]);

    const commitBrand = (next: OklchColor) => {
        // Always clear the live preview; only persist an actual change so
        // opening/closing the picker (or re-clicking the active preset)
        // doesn't fire a no-op mutation.
        setLiveVar('--brand', null);
        if (oklchEqual(next, brand)) return;
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
        if (value === backdrop.intensity) return;
        update({
            styles: {
                ...styles,
                backdrop: { style: backdrop.style, intensity: value },
            },
        });
    };

    return (
        <div className="flex w-full flex-col gap-8">
            <Field
                title="Основний колір"
                description="Оберіть пресет або власний акцентний колір"
            >
                <div className="flex flex-wrap items-center gap-2">
                    {ACCENT_PRESETS.map((preset) => {
                        const isActive = oklchEqual(brand, preset.brand);
                        return (
                            <Swatch
                                key={preset.name}
                                title={preset.name}
                                aria-label={preset.name}
                                active={isActive}
                                onClick={() => commitBrand(preset.brand)}
                                style={{
                                    backgroundColor: oklchToCss(preset.brand),
                                }}
                            >
                                {isActive && <Check />}
                            </Swatch>
                        );
                    })}
                    <BrandColorPicker
                        value={brand}
                        active={!activePreset}
                        onPreview={(next) =>
                            setLiveVar('--brand', oklchToCss(next))
                        }
                        onCommit={commitBrand}
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                            {activePreset?.name ?? 'Власний'}
                        </span>
                        <span className="rounded-md bg-secondary px-2 py-1 font-mono text-xs">
                            {oklchToHex(brand)}
                        </span>
                    </div>
                </div>
            </Field>

            <Field
                title="Радіус заокруглення"
                description="Заокруглення кутів кнопок, карток та полів"
            >
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
            </Field>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Фоновий градієнт</Label>
                        <span className="text-muted-foreground text-xs">
                            Акцентне сяйво вгорі сторінки
                        </span>
                    </div>
                    <Switch
                        checked={backdrop.style === 'glow'}
                        onCheckedChange={(checked) =>
                            setBackdropStyle(checked ? 'glow' : 'none')
                        }
                    />
                </div>
                {backdrop.style === 'glow' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Інтенсивність</Label>
                            <span className="text-muted-foreground text-sm">
                                {Math.round(intensity * 100)}%
                            </span>
                        </div>
                        <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={[intensity]}
                            onValueChange={([value]) => {
                                setIntensity(value);
                                setLiveVar(
                                    '--backdrop-intensity',
                                    String(value),
                                );
                            }}
                            onValueCommit={([value]) => commitIntensity(value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StylesSettings;
