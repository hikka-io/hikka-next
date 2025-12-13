/**
 * Default UI styles and appearance settings.
 */
import { UIStyles, UserAppearance } from '@hikka/client';

/**
 * Default UI styles for light and dark themes.
 */
export const DEFAULT_STYLES: UIStyles = {
    light: {
        colors: {
            background: { h: 0, s: 0, l: 100 },
            foreground: { h: 240, s: 10, l: 4 },
            primary: { h: 321, s: 100, l: 95 },
            primary_foreground: { h: 321, s: 70, l: 65 },
            primary_border: { h: 321, s: 90, l: 90 },
            secondary: { h: 0, s: 0, l: 96 },
            secondary_foreground: { h: 0, s: 0, l: 9 },
            muted: { h: 240, s: 5, l: 96 },
            muted_foreground: { h: 240, s: 4, l: 46 },
            accent: { h: 240, s: 5, l: 96 },
            accent_foreground: { h: 240, s: 6, l: 10 },
            border: { h: 240, s: 6, l: 90 },
            input: { h: 240, s: 6, l: 90 },
            ring: { h: 240, s: 6, l: 10 },
            popover: { h: 0, s: 0, l: 100 },
            popover_foreground: { h: 240, s: 10, l: 4 },
        },
    },
    dark: {
        colors: {
            background: { h: 0, s: 0, l: 0 },
            foreground: { h: 0, s: 0, l: 98 },
            primary: { h: 300, s: 10, l: 5 },
            primary_foreground: { h: 321, s: 70, l: 69 },
            primary_border: { h: 321, s: 43, l: 17 },
            secondary: { h: 240, s: 4, l: 16 },
            secondary_foreground: { h: 0, s: 0, l: 98 },
            muted: { h: 240, s: 4, l: 16 },
            muted_foreground: { h: 240, s: 5, l: 65 },
            accent: { h: 240, s: 4, l: 16 },
            accent_foreground: { h: 0, s: 0, l: 98 },
            border: { h: 240, s: 4, l: 10 },
            input: { h: 240, s: 4, l: 10 },
            ring: { h: 240, s: 5, l: 84 },
            popover: { h: 240, s: 10, l: 4 },
            popover_foreground: { h: 0, s: 0, l: 98 },
        },
    },
    radius: '0.625rem',
};

/**
 * Default user appearance settings.
 */
export const DEFAULT_APPEARANCE: UserAppearance = {
    styles: DEFAULT_STYLES,
    preferences: {
        title_language: 'title_ua',
        name_language: 'name_ua',
        effects: [],
    },
};
