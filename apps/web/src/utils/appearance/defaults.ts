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
            accent_foreground: { h: 240, s: 6, l: 10 },
            border: { h: 240, s: 6, l: 90 },
            ring: { h: 240, s: 6, l: 10 },
            popover: { h: 0, s: 0, l: 100 },
            popover_foreground: { h: 240, s: 10, l: 4 },
            // Sidebar colors
            sidebar_background: { h: 0, s: 0, l: 100 },
            sidebar_foreground: { h: 240, s: 5.3, l: 26.1 },
            sidebar_primary: { h: 240, s: 5.9, l: 10 },
            sidebar_primary_foreground: { h: 0, s: 0, l: 98 },
            sidebar_accent: { h: 240, s: 4.8, l: 95.9 },
            sidebar_accent_foreground: { h: 240, s: 5.9, l: 10 },
            sidebar_border: { h: 220, s: 13, l: 91 },
            sidebar_ring: { h: 217.2, s: 91.2, l: 59.8 },
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
            accent_foreground: { h: 0, s: 0, l: 98 },
            border: { h: 240, s: 4, l: 10 },
            ring: { h: 240, s: 5, l: 84 },
            popover: { h: 240, s: 10, l: 4 },
            popover_foreground: { h: 0, s: 0, l: 98 },
            // Sidebar colors
            sidebar_background: { h: 0, s: 0, l: 0 },
            sidebar_foreground: { h: 240, s: 4.8, l: 95.9 },
            sidebar_primary: { h: 224.3, s: 76.3, l: 48 },
            sidebar_primary_foreground: { h: 0, s: 0, l: 100 },
            sidebar_accent: { h: 240, s: 3.7, l: 15.9 },
            sidebar_accent_foreground: { h: 240, s: 4.8, l: 95.9 },
            sidebar_border: { h: 240, s: 3.7, l: 15.9 },
            sidebar_ring: { h: 217.2, s: 91.2, l: 59.8 },
        },
        body: {
            background_image:
                'linear-gradient(#160820 0%, transparent 60% 100%)',
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
        overlay: true,
    },
};
