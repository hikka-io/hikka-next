'use client';

import { HSLColor, UIColorTokens, UIStyles } from '@hikka/client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HslColor, HslColorPicker } from 'react-colorful';

import { CollapsibleFilter } from '@/components/collapsible-filter';
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

import { useModalContext } from '@/services/providers/modal-provider';
import { useUIStore } from '@/services/providers/ui-store-provider';
import { DEFAULT_STYLES } from '@/utils/appearance';
import {
    formatHSL,
    hexToHsl,
    hslToHex,
    toHSLString,
    toHikkaColor,
    toReactColorful,
} from '@/utils/appearance/color';
import { stylesToReactStyles } from '@/utils/appearance/inject-styles';

type ColorPreset = {
    name: string;
    color: string;
    styles: UIStyles;
};

const createPrimaryPreset = (h: number): UIStyles => ({
    light: {
        colors: {
            primary: { h, s: 100, l: 95 },
            primary_foreground: { h, s: 70, l: 45 },
            primary_border: { h, s: 90, l: 90 },
        },
        body: {
            background_image: undefined,
        },
    },
    dark: {
        colors: {
            primary: { h, s: 10, l: 5 },
            primary_foreground: { h, s: 70, l: 69 },
            primary_border: { h, s: 43, l: 17 },
        },
        body: {
            background_image: `linear-gradient(hsl(${h}, 60%, 8%) 0%, transparent 60% 100%)`,
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

const COLOR_TOKEN_LABELS: Record<keyof UIColorTokens, string> = {
    primary: 'Основний',
    primary_foreground: 'Текст основного',
    primary_border: 'Рамка основного',
    background: 'Фон',
    foreground: 'Текст',
    secondary: 'Вторинний',
    secondary_foreground: 'Текст вторинного',
    muted: 'Приглушений',
    muted_foreground: 'Текст приглушеного',
    accent_foreground: 'Текст акценту',
    border: 'Рамка',
    ring: 'Кільце фокусу',
    popover: 'Спливаюче вікно',
    popover_foreground: 'Текст спливаючого вікна',
    sidebar_foreground: 'Текст бокової панелі',
    sidebar_primary: 'Основний колір бокової панелі',
    sidebar_primary_foreground: 'Текст основного кольору бокової панелі',
    sidebar_accent: 'Акцентний колір бокової панелі',
    sidebar_accent_foreground: 'Текст акцентного кольору бокової панелі',
    sidebar_border: 'Рамка бокової панелі',
    sidebar_ring: 'Кільце фокусу бокової панелі',
    sidebar_background: 'Фон бокової панелі',
};

const PRIMARY_TOKENS: (keyof UIColorTokens)[] = [
    'primary',
    'primary_foreground',
    'primary_border',
];

const SURFACE_TOKENS: (keyof UIColorTokens)[] = [
    'background',
    'foreground',
    'secondary',
    'secondary_foreground',
    'muted',
    'muted_foreground',
];

const UI_TOKENS: (keyof UIColorTokens)[] = [
    'accent_foreground',
    'border',
    'ring',
    'popover',
    'popover_foreground',
];

const SIDEBAR_TOKENS: (keyof UIColorTokens)[] = [
    'sidebar_background',
    'sidebar_foreground',
    'sidebar_primary',
    'sidebar_primary_foreground',
    'sidebar_accent',
    'sidebar_accent_foreground',
    'sidebar_border',
    'sidebar_ring',
];

interface ColorTokenButtonProps {
    token: keyof UIColorTokens;
    color: HSLColor | undefined;
    onColorChange: (color: HSLColor) => void;
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
    }, [color?.h, color?.s, color?.l]);

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
    tokens: (keyof UIColorTokens)[];
    keyPrefix: string;
    getColor: (token: keyof UIColorTokens) => HSLColor | undefined;
    onColorChange: (token: keyof UIColorTokens, color: HSLColor) => void;
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
    <div>
        <CollapsibleFilter className="" title="Набори">
            <div className="flex flex-wrap gap-2">
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
        </CollapsibleFilter>
    </div>
);

interface ThemeTabContentProps {
    theme: 'light' | 'dark';
}

const ThemeTabContent = ({ theme }: ThemeTabContentProps) => {
    const appearance = useUIStore((state) => state);
    const setColorToken = useUIStore((state) => state.setColorToken);
    const setBody = useUIStore((state) => state.setBody);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getColor = (token: keyof UIColorTokens) =>
        appearance.styles?.[theme]?.colors?.[token];

    const handleColorChange = (token: keyof UIColorTokens, color: HSLColor) => {
        setColorToken(theme, token, color);
    };

    const handlePresetSelect = (preset: ColorPreset) => {
        const presetColors = preset.styles[theme]?.colors;
        if (!presetColors) return;

        (Object.keys(presetColors) as (keyof UIColorTokens)[]).forEach(
            (token) => {
                const color = presetColors[token];
                if (color) {
                    setColorToken(theme, token, color);
                }
            },
        );

        const presetBody = preset.styles[theme]?.body;
        if (presetBody) {
            setBody(theme, presetBody);
        }
    };

    const getSelectedPresetName = (): string | null => {
        const currentColors = appearance.styles?.[theme]?.colors;
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
                                    background_image: e.target.value,
                                })
                            }
                            type="text"
                            value={
                                appearance.styles?.[theme]?.body
                                    ?.background_image ?? ''
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
                        title="UI елементи"
                        tokens={UI_TOKENS}
                        keyPrefix={theme}
                        getColor={getColor}
                        onColorChange={handleColorChange}
                    />
                    <TokenGroup
                        title="Бокова панель"
                        tokens={SIDEBAR_TOKENS}
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
    const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('dark');

    const syncUserUI = useUIStore((state) => state.syncUserUI);
    const updateUserUI = useUIStore((state) => state.updateUserUI);

    const styles = useUIStore((state) => state.styles);
    const { root, dark } = stylesToReactStyles(styles);

    const handleResetToDefault = () => {
        syncUserUI();
    };

    const saveChanges = () => {
        updateUserUI().then(() => {
            closeModal();
        });
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
                <Card
                    className="p-0 gap-0 overflow-hidden bg-background top-4 sticky align-self-start h-fit"
                    style={activeTheme === 'light' ? root : dark}
                >
                    <div className="border-b p-4 flex gap-4 w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-50" />
                            <div className="w-3 h-3 rounded-full bg-green-400 opacity-50" />
                        </div>
                        <Label className="text-foreground">
                            Попередній перегляд
                        </Label>
                    </div>
                    <div className="p-4 flex gap-2 flex-wrap items-start justify-start h-fit">
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
                        <p className="text-foreground">
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
            <div className="flex flex-col md:flex-row justify-end gap-4 items-start md:items-center md:justify-between -mx-6 px-6 py-4 border-t sticky bottom-0 bg-background">
                <Button
                    variant="destructive"
                    className="w-full md:w-auto"
                    size="md"
                    onClick={handleResetToDefault}
                >
                    Скинути зміни
                </Button>
                <div className="flex gap-2 items-center w-full justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => closeModal(false)}
                        size="md"
                    >
                        Скасувати
                    </Button>
                    <Button variant="default" onClick={saveChanges} size="md">
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

    const syncUserUI = useUIStore((state) => state.syncUserUI);

    const handleRadiusChange = (value: string) => {
        setRadius(value ? `${value}rem` : undefined);
    };

    const handleOpenCustomModal = () => {
        openModal({
            content: <CustomColorsModal />,
            title: 'Налаштування кольорів',
            description: 'Персоналізуйте кольори сайту',
            forceModal: true,
            className: '!max-w-4xl',
            onClose: syncUserUI,
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
