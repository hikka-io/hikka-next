import { UIColorTokens, UIStyles } from '@hikka/client';

import { DEFAULT_STYLES } from '@/utils/ui';

export type ColorPreset = {
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

export const COLOR_PRESETS: ColorPreset[] = [
    { name: 'За замовчуванням', color: '#e779c1', styles: DEFAULT_STYLES },
    { name: 'Синій', color: '#6390e8', styles: createPrimaryPreset(217) },
    { name: 'Зелений', color: '#63e88a', styles: createPrimaryPreset(142) },
    { name: 'Помаранчевий', color: '#e8a063', styles: createPrimaryPreset(25) },
    { name: 'Фіолетовий', color: '#a063e8', styles: createPrimaryPreset(270) },
    { name: 'Червоний', color: '#e86363', styles: createPrimaryPreset(0) },
    { name: 'Бірюзовий', color: '#63e8e8', styles: createPrimaryPreset(180) },
];

export const COLOR_TOKEN_LABELS: Record<keyof UIColorTokens, string> = {
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

export const PRIMARY_TOKENS: (keyof UIColorTokens)[] = [
    'primary',
    'primary_foreground',
    'primary_border',
];

export const SURFACE_TOKENS: (keyof UIColorTokens)[] = [
    'background',
    'foreground',
    'secondary',
    'secondary_foreground',
    'muted',
    'muted_foreground',
];

export const UI_TOKENS: (keyof UIColorTokens)[] = [
    'accent_foreground',
    'border',
    'ring',
    'popover',
    'popover_foreground',
];

export const SIDEBAR_TOKENS: (keyof UIColorTokens)[] = [
    'sidebar_background',
    'sidebar_foreground',
    'sidebar_primary',
    'sidebar_primary_foreground',
    'sidebar_accent',
    'sidebar_accent_foreground',
    'sidebar_border',
    'sidebar_ring',
];

export const PREVIEW_COLOR_TOKENS: (keyof UIColorTokens)[] = [
    'primary',
    'primary_foreground',
    'primary_border',
    'background',
    'foreground',
];
