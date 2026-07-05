import { type ReactNode, useEffect, useRef, useState } from 'react';

import type { OklchColor, UiBackdrop } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { ACCENT_PRESETS } from '@/utils/constants/styles';
import {
    applyBackdrop,
    clearLivePreview,
    DEFAULT_BRAND,
    setLiveVar,
} from '@/utils/ui';
import { oklchEqual, oklchToCss } from '@/utils/ui/color';

import ColorField from './components/color-field';

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
    const currentRadius = styles.radius?.replace('rem', '') ?? '0.625';

    // Local state tracks the thumb during drag; query commits on release.
    const [intensity, setIntensity] = useState(backdrop.intensity);
    useEffect(() => setIntensity(backdrop.intensity), [backdrop.intensity]);

    const backdropRef = useRef(backdrop);
    useEffect(() => {
        backdropRef.current = backdrop;
    }, [backdrop]);

    // On unmount, drop leaked preview vars. Backdrop vars are inline-only, so
    // re-assert the saved backdrop instead of blanking the glow until reload.
    useEffect(
        () => () => {
            clearLivePreview();
            applyBackdrop(backdropRef.current);
        },
        [],
    );

    const commitBrand = (next: OklchColor) => {
        // Clear preview; skip no-op mutation when re-clicking the active preset.
        setLiveVar('--brand', null);
        if (oklchEqual(next, brand)) return;
        update({ styles: { ...styles, brand: next } });
    };

    const setRadius = (value: string) => {
        update({
            styles: { ...styles, radius: value ? `${value}rem` : undefined },
        });
    };

    // Preserve the picked backdrop color across style/intensity edits.
    const currentBackdrop = (): UiBackdrop => {
        const next: UiBackdrop = {
            style: backdrop.style,
            intensity: backdrop.intensity,
        };
        if (backdrop.color) next.color = backdrop.color;
        return next;
    };

    const setBackdropStyle = (style: 'none' | 'glow') => {
        // Use currentBackdrop()'s committed intensity, not the mid-drag local state.
        update({
            styles: {
                ...styles,
                backdrop: { ...currentBackdrop(), style },
            },
        });
    };

    const commitIntensity = (value: number) => {
        if (value === backdrop.intensity) return;
        update({
            styles: {
                ...styles,
                backdrop: { ...currentBackdrop(), intensity: value },
            },
        });
    };

    const commitBackdropColor = (next: OklchColor | null) => {
        if (oklchEqual(next, backdrop.color)) {
            applyBackdrop(backdrop);
            return;
        }
        const nextBackdrop = currentBackdrop();
        if (next) nextBackdrop.color = next;
        else delete nextBackdrop.color;
        update({ styles: { ...styles, backdrop: nextBackdrop } });
    };

    return (
        <div className="flex w-full flex-col gap-8">
            <Field
                title="Основний колір"
                description="Оберіть пресет або власний акцентний колір"
            >
                <ColorField
                    value={brand}
                    presets={ACCENT_PRESETS}
                    onSelect={commitBrand}
                    onPreview={(next) =>
                        setLiveVar('--brand', oklchToCss(next))
                    }
                    onCommit={commitBrand}
                />
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
                    <div className="flex flex-col gap-4">
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
                                onValueCommit={([value]) =>
                                    commitIntensity(value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Колір градієнту</Label>
                            <ColorField
                                value={backdrop.color ?? brand}
                                presets={ACCENT_PRESETS}
                                auto={{
                                    active: !backdrop.color,
                                    label: 'Як акцент',
                                    previewColor: brand,
                                    onSelect: () => commitBackdropColor(null),
                                }}
                                onSelect={commitBackdropColor}
                                onPreview={(next) =>
                                    setLiveVar(
                                        '--backdrop-color',
                                        oklchToCss(next),
                                    )
                                }
                                onCommit={commitBackdropColor}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StylesSettings;
