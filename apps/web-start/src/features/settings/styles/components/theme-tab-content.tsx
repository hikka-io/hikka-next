'use client';

import { HSLColor, UIColorTokens } from '@hikka/client';
import { useRef } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    COLOR_PRESETS,
    ColorPreset,
    PRIMARY_TOKENS,
    SURFACE_TOKENS,
    UI_TOKENS,
} from '@/utils/constants/styles';
import { DEFAULT_STYLES } from '@/utils/ui';

import { useStylesEditor } from './custom-colors-modal';
import PresetButtons from './preset-buttons';
import TokenGroup from './token-group';

interface ThemeTabContentProps {
    theme: 'light' | 'dark';
}

const ThemeTabContent = ({ theme }: ThemeTabContentProps) => {
    const styles = useStylesEditor((state) => state.styles);
    const setColorToken = useStylesEditor((state) => state.setColorToken);
    const setThemeColors = useStylesEditor((state) => state.setThemeColors);
    const setBody = useStylesEditor((state) => state.setBody);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getColor = (token: keyof UIColorTokens) =>
        styles?.[theme]?.colors?.[token] ??
        DEFAULT_STYLES[theme]?.colors?.[token];

    const handleColorChange = (token: keyof UIColorTokens, color: HSLColor) => {
        setColorToken(theme, token, color);
    };

    const handlePresetSelect = (preset: ColorPreset) => {
        const presetColors = preset.styles[theme]?.colors;
        if (!presetColors) return;

        // Batch update all preset colors in a single store update
        setThemeColors(theme, presetColors);

        const presetBody = preset.styles[theme]?.body;
        if (presetBody) {
            setBody(theme, presetBody);
        }
    };

    const getSelectedPresetName = (): string | null => {
        const currentColors = styles?.[theme]?.colors;
        if (!currentColors) return null;

        const matchingPreset = COLOR_PRESETS.find((preset) => {
            const presetColors = preset.styles[theme]?.colors;
            if (!presetColors) return false;

            const primaryMatch =
                currentColors.primary?.h === presetColors.primary?.h &&
                currentColors.primary?.s === presetColors.primary?.s &&
                currentColors.primary?.l === presetColors.primary?.l;

            return primaryMatch;
        });

        return matchingPreset?.name ?? null;
    };

    return (
        <div className="mt-4 flex flex-col gap-4">
            <PresetButtons
                onPresetSelect={handlePresetSelect}
                selectedPresetName={getSelectedPresetName()}
            />
            <div ref={scrollRef}>
                <div className="flex flex-col gap-6 py-2">
                    <div className="flex flex-col gap-2">
                        <Label>Градієнт</Label>
                        <Input
                            placeholder="Введіть CSS-значення для градієнта"
                            onChange={(e) =>
                                setBody(theme, {
                                    background_image: e.target.value
                                        ? e.target.value
                                        : undefined,
                                })
                            }
                            type="text"
                            value={
                                styles?.[theme]?.body?.background_image ?? ''
                            }
                        />
                    </div>
                    <TokenGroup
                        title="Основні кольори"
                        tokens={PRIMARY_TOKENS}
                        keyPrefix={theme}
                        getColor={getColor}
                        onColorChange={handleColorChange}
                    />
                    <TokenGroup
                        title="Поверхні"
                        tokens={SURFACE_TOKENS}
                        keyPrefix={theme}
                        getColor={getColor}
                        onColorChange={handleColorChange}
                    />
                    <TokenGroup
                        title="Елементи інтерфейсу"
                        tokens={UI_TOKENS}
                        keyPrefix={theme}
                        getColor={getColor}
                        onColorChange={handleColorChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThemeTabContent;
