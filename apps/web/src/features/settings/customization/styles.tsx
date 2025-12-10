'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HslColor, HslColorPicker } from 'react-colorful';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverPortal,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { useModalContext } from '@/services/providers/modal-provider';
import { useUIStore } from '@/services/stores/ui-store';
import { DEFAULT_STYLES } from '@/utils/appearance';
import {
    formatHSL,
    hexToHsl,
    hslToHex,
    toHSLString,
    toHikkaColor,
    toReactColorful,
} from '@/utils/color-utils';
import { cn } from '@/utils/utils';

type ColorPreset = {
    name: string;
    color: string;
    styles: Hikka.UIStyles;
};

const createPrimaryPreset = (hue: number): Hikka.UIStyles => ({
    light: {
        colors: {
            primary: { hue, saturation: 100, lightness: 95 },
            primaryForeground: { hue, saturation: 70, lightness: 45 },
            primaryBorder: { hue, saturation: 90, lightness: 90 },
        },
    },
    dark: {
        colors: {
            primary: { hue, saturation: 10, lightness: 5 },
            primaryForeground: { hue, saturation: 70, lightness: 69 },
            primaryBorder: { hue, saturation: 43, lightness: 17 },
        },
    },
});

const COLOR_PRESETS: ColorPreset[] = [
    { name: 'За замовчуванням', color: '#e779c1', styles: DEFAULT_STYLES },
    { name: 'Синій', color: '#6390e8', styles: createPrimaryPreset(217) },
    { name: 'Зелений', color: '#63e88a', styles: createPrimaryPreset(142) },
    { name: 'Помаранчевий', color: '#e8a063', styles: createPrimaryPreset(25) },
    { name: 'Фіолетовий', color: '#a063e8', styles: createPrimaryPreset(270) },
    { name: 'Червоний', color: '#e86363', styles: createPrimaryPreset(0) },
    { name: 'Бірюзовий', color: '#63e8e8', styles: createPrimaryPreset(180) },
];

const COLOR_TOKEN_LABELS: Record<keyof Hikka.UIColorTokens, string> = {
    primary: 'Основний',
    primaryForeground: 'Текст основного',
    primaryBorder: 'Рамка основного',
    background: 'Фон',
    foreground: 'Текст',
    secondary: 'Вторинний',
    secondaryForeground: 'Текст вторинного',
    muted: 'Приглушений',
    mutedForeground: 'Текст приглушеного',
    accent: 'Акцент',
    accentForeground: 'Текст акценту',
    border: 'Рамка',
    input: 'Поле введення',
    ring: 'Кільце фокусу',
    popover: 'Спливаюче вікно',
    popoverForeground: 'Текст спливаючого вікна',
};

const PRIMARY_TOKENS: (keyof Hikka.UIColorTokens)[] = [
    'primary',
    'primaryForeground',
    'primaryBorder',
];

const SURFACE_TOKENS: (keyof Hikka.UIColorTokens)[] = [
    'background',
    'foreground',
    'secondary',
    'secondaryForeground',
    'muted',
    'mutedForeground',
];

const UI_TOKENS: (keyof Hikka.UIColorTokens)[] = [
    'accent',
    'accentForeground',
    'border',
    'input',
    'ring',
    'popover',
    'popoverForeground',
];

interface ColorTokenButtonProps {
    token: keyof Hikka.UIColorTokens;
    color: Hikka.HSLColor | undefined;
    onColorChange: (color: Hikka.HSLColor) => void;
}

const ColorTokenButton = ({
    token,
    color,
    onColorChange,
}: ColorTokenButtonProps) => {
    const [localColor, setLocalColor] = useState<HslColor>(
        toReactColorful(color),
    );
    const [hexInput, setHexInput] = useState(
        hslToHex(localColor.h, localColor.s, localColor.l),
    );

    useEffect(() => {
        const newColor = toReactColorful(color);
        setLocalColor(newColor);
        setHexInput(hslToHex(newColor.h, newColor.s, newColor.l));
    }, [color?.hue, color?.saturation, color?.lightness]);

    const handleChange = (newColor: HslColor) => {
        setLocalColor(newColor);
        setHexInput(hslToHex(newColor.h, newColor.s, newColor.l));
    };

    const handleChangeComplete = () => {
        onColorChange(toHikkaColor(localColor));
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexInput(value);

        const normalizedHex = value.startsWith('#') ? value : `#${value}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(normalizedHex)) {
            const hsl = hexToHsl(normalizedHex);
            if (hsl) {
                setLocalColor(hsl);
                onColorChange(toHikkaColor(hsl));
            }
        }
    };

    const handleHexBlur = () => {
        setHexInput(hslToHex(localColor.h, localColor.s, localColor.l));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="text-left justify-start overflow-hidden"
                >
                    <div
                        className="size-8 rounded-md border shrink-0"
                        style={{ backgroundColor: toHSLString(color) }}
                    />
                    <div className="flex flex-col flex-1 truncate">
                        <span className="truncate">
                            {COLOR_TOKEN_LABELS[token]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatHSL(color) ?? 'Не вибрано'}
                        </span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent className="min-w-52 p-4 z-[999]">
                    <div className="flex flex-col gap-4 w-full">
                        <HslColorPicker
                            className="!w-full"
                            color={localColor}
                            onChange={handleChange}
                            onMouseUp={handleChangeComplete}
                            onTouchEnd={handleChangeComplete}
                        />
                        <div className="flex items-center gap-2 w-full">
                            <div
                                className="size-8 rounded-md border shrink-0"
                                style={{
                                    backgroundColor: hslToHex(
                                        localColor.h,
                                        localColor.s,
                                        localColor.l,
                                    ),
                                }}
                            />
                            <Input
                                value={hexInput}
                                onChange={handleHexChange}
                                onBlur={handleHexBlur}
                                placeholder="#000000"
                                className="font-mono uppercase h-8 flex-1"
                                maxLength={7}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
};

interface TokenGroupProps {
    title: string;
    tokens: (keyof Hikka.UIColorTokens)[];
    keyPrefix: string;
    getColor: (token: keyof Hikka.UIColorTokens) => Hikka.HSLColor | undefined;
    onColorChange: (
        token: keyof Hikka.UIColorTokens,
        color: Hikka.HSLColor,
    ) => void;
}

const TokenGroup = ({
    title,
    tokens,
    keyPrefix,
    getColor,
    onColorChange,
}: TokenGroupProps) => (
    <div className="flex flex-col gap-2">
        <Label>{title}</Label>
        <div className="grid grid-cols-2 gap-2 w-full">
            {tokens.map((token) => (
                <ColorTokenButton
                    key={`${keyPrefix}-${token}`}
                    token={token}
                    color={getColor(token)}
                    onColorChange={(color) => onColorChange(token, color)}
                />
            ))}
        </div>
    </div>
);

interface PresetButtonsProps {
    onPresetSelect: (preset: ColorPreset) => void;
    selectedPresetName: string | null;
}

const PresetButtons = ({
    onPresetSelect,
    selectedPresetName,
}: PresetButtonsProps) => (
    <div className="flex flex-col gap-2">
        <Label>Набори</Label>
        <div className="flex flex-wrap gap-2 w-full">
            {COLOR_PRESETS.map((preset) => (
                <Button
                    key={preset.name}
                    variant={
                        selectedPresetName === preset.name
                            ? 'default'
                            : 'outline'
                    }
                    size="badge"
                    className="text-left justify-start"
                    onClick={() => onPresetSelect(preset)}
                >
                    <div
                        className="size-3 rounded-full border"
                        style={{ backgroundColor: preset.color }}
                    />
                    {preset.name}
                </Button>
            ))}
        </div>
    </div>
);

interface ThemeTabContentProps {
    theme: 'light' | 'dark';
}

const ThemeTabContent = ({ theme }: ThemeTabContentProps) => {
    const appearance = useUIStore((state) => state);
    const setColorToken = useUIStore((state) => state.setColorToken);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(scrollRef);

    const getColor = (token: keyof Hikka.UIColorTokens) =>
        appearance.styles?.[theme]?.colors?.[token];

    const handleColorChange = (
        token: keyof Hikka.UIColorTokens,
        color: Hikka.HSLColor,
    ) => {
        setColorToken(theme, token, color);
    };

    const handlePresetSelect = (preset: ColorPreset) => {
        const presetColors = preset.styles[theme]?.colors;
        if (!presetColors) return;

        (Object.keys(presetColors) as (keyof Hikka.UIColorTokens)[]).forEach(
            (token) => {
                const color = presetColors[token];
                if (color) {
                    setColorToken(theme, token, color);
                }
            },
        );
    };

    const getSelectedPresetName = (): string | null => {
        const currentColors = appearance.styles?.[theme]?.colors;
        if (!currentColors) return null;

        const matchingPreset = COLOR_PRESETS.find((preset) => {
            const presetColors = preset.styles[theme]?.colors;
            if (!presetColors) return false;

            const primaryMatch =
                currentColors.primary?.hue === presetColors.primary?.hue &&
                currentColors.primary?.saturation ===
                    presetColors.primary?.saturation &&
                currentColors.primary?.lightness ===
                    presetColors.primary?.lightness;

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
            <div
                ref={scrollRef}
                className={cn(
                    '-mx-4 max-h-80 overflow-y-auto px-4',
                    'styled-scrollbar',
                    gradientClassName,
                )}
            >
                <div className="flex flex-col gap-6 py-2">
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
                        title="UI елементи"
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

const CustomColorsModal = () => {
    const { closeModal } = useModalContext();
    const setStyles = useUIStore((state) => state.setStyles);
    const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark');

    const handleResetToDefault = () => {
        setStyles(DEFAULT_STYLES);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Tabs
                    defaultValue="dark"
                    onValueChange={(v) => setActiveTheme(v as 'light' | 'dark')}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="light">
                            <Sun className="size-4" /> Світла тема
                        </TabsTrigger>
                        <TabsTrigger value="dark">
                            <Moon className="size-4" /> Темна тема
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="light">
                        <ThemeTabContent theme="light" />
                    </TabsContent>
                    <TabsContent value="dark">
                        <ThemeTabContent theme="dark" />
                    </TabsContent>
                </Tabs>
                <Card className="p-0 gap-0">
                    <div className="border-b p-4 flex items-center justify-start gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-green-400 opacity-50" />
                        </div>
                        <Label>Попередній перегляд</Label>
                    </div>
                    <div className="p-4 flex gap-2 flex-wrap items-start justify-start bg-background">
                        <Button variant="default">Основна кнопка</Button>
                        <Button variant="outline" size="md">
                            Контурна кнопка
                        </Button>
                        <Button variant="secondary" size="md">
                            Вторинна кнопка
                        </Button>
                        <Button variant="default" size="sm">
                            Основна кнопка SM
                        </Button>

                        <Button variant="default" size="badge">
                            Основна кнопка-бейдж
                        </Button>
                        <p>
                            Порушивши головну заборону алхімії та намагаючись
                            воскресити{' '}
                            <span className="text-primary-foreground hover:underline hover:cursor-pointer">
                                матір
                            </span>
                            , талановиті брати Елріки заплатили за це високу
                            ціну: молодший,{' '}
                            <span className="text-primary-foreground hover:underline hover:cursor-pointer">
                                Альфонс
                            </span>
                            , втратив своє тіло, і його душа була прикріплена до
                            сталевих обладунків, а старший,{' '}
                            <span className="text-primary-foreground hover:underline hover:cursor-pointer">
                                Едвард
                            </span>
                            , позбувся руки та ноги, тому змушений користуватися
                            протезами.
                        </p>
                    </div>
                </Card>
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-4 items-start md:items-center md:justify-between">
                <Button
                    variant="destructive"
                    className="w-full md:w-auto"
                    size="md"
                    onClick={handleResetToDefault}
                >
                    Скинути зміни
                </Button>
                <div className="flex gap-2 items-center w-full justify-end">
                    <Button variant="ghost" onClick={closeModal} size="md">
                        Скасувати
                    </Button>
                    <Button variant="default" onClick={closeModal} size="md">
                        Зберегти
                    </Button>
                </div>
            </div>
        </div>
    );
};

const StylesSettings = () => {
    const { openModal } = useModalContext();
    const appearance = useUIStore((state) => state);
    const setRadius = useUIStore((state) => state.setRadius);

    const handleRadiusChange = (value: string) => {
        setRadius(value ? `${value}rem` : undefined);
    };

    const handleOpenCustomModal = () => {
        openModal({
            content: <CustomColorsModal />,
            title: 'Налаштування кольорів',
            description: 'Персоналізуйте кольори сайту',
            forceModal: true,
            className: '!max-w-3xl',
        });
    };

    const currentRadius = appearance.styles?.radius?.replace('rem', '') ?? '';

    const darkColors = appearance.styles?.dark?.colors;

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Палітра кольорів</Label>
                <div className="flex flex-wrap gap-2">
                    <div
                        className="size-10 rounded-md border"
                        style={{
                            backgroundColor: toHSLString(
                                darkColors?.background,
                            ),
                        }}
                    />
                    <div
                        className="size-10 rounded-md border"
                        style={{
                            backgroundColor: toHSLString(darkColors?.primary),
                        }}
                    />
                    <div
                        className="size-10 rounded-md border"
                        style={{
                            backgroundColor: toHSLString(darkColors?.secondary),
                        }}
                    />
                    <div
                        className="size-10 rounded-md border"
                        style={{
                            backgroundColor: toHSLString(darkColors?.muted),
                        }}
                    />
                    <Button onClick={handleOpenCustomModal} size="md">
                        <MaterialSymbolsAddRounded className="size-4" />
                        Налаштувати кольори
                    </Button>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label>Радіус заокруглення</Label>
                <div className="flex gap-2 flex-wrap">
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

export default StylesSettings;
