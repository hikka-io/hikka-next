import type { OklchColor } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useUpdateSessionUI } from '@/features/auth/hooks/use-update-session-ui';
import { ACCENT_PRESETS } from '@/utils/constants/styles';
import { DEFAULT_STYLES } from '@/utils/ui';
import { oklchToCss } from '@/utils/ui/color';

import BrandColorPicker from './components/brand-color-picker';

const RADIUS_OPTIONS: { value: string; label: string }[] = [
    { value: '0', label: 'Без' },
    { value: '0.25', label: 'XS' },
    { value: '0.5', label: 'SM' },
    { value: '0.625', label: 'MD' },
    { value: '0.75', label: 'LG' },
    { value: '1.5', label: 'XL' },
];

const oklchEqual = (a: OklchColor, b: OklchColor) =>
    a.l === b.l && a.c === b.c && a.h === b.h;

const StylesSettings = () => {
    const { styles, backdrop } = useSessionUI();
    const { update } = useUpdateSessionUI();

    const brand = styles.brand ??
        DEFAULT_STYLES.brand ?? { l: 0.7, c: 0.18, h: 343 };

    const previewBrand = (next: OklchColor) => {
        document.documentElement.style.setProperty('--brand', oklchToCss(next));
    };

    const commitBrand = (next: OklchColor) => {
        document.documentElement.style.removeProperty('--brand');
        update({ styles: { ...styles, brand: next } });
    };

    const setRadius = (value: string) => {
        update({
            styles: { ...styles, radius: value ? `${value}rem` : undefined },
        });
    };

    const setBackdropStyle = (style: 'none' | 'glow') => {
        update({
            styles: {
                ...styles,
                backdrop: { style, intensity: backdrop.intensity },
            },
        });
    };

    const commitBackdropIntensity = (intensity: number) => {
        update({
            styles: {
                ...styles,
                backdrop: { style: backdrop.style, intensity },
            },
        });
    };

    const currentRadius = styles.radius?.replace('rem', '') ?? '0.625';

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Колір бренду</Label>
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
                        onPreview={previewBrand}
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
                <Label>Фонове сяйво</Label>
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
                        value={[backdrop.intensity]}
                        showValue="on-interaction"
                        formatValue={(value) => `${Math.round(value * 100)}%`}
                        onValueChange={([value]) =>
                            document.documentElement.style.setProperty(
                                '--backdrop-intensity',
                                String(value),
                            )
                        }
                        onValueCommit={([value]) =>
                            commitBackdropIntensity(value)
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default StylesSettings;
