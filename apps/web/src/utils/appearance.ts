/**
 * Shared utilities for user appearance management.
 */

/**
 * Default UI styles for light and dark themes.
 */
export const DEFAULT_STYLES: Hikka.UIStyles = {
    light: {
        colors: {
            background: { hue: 0, saturation: 0, lightness: 100 },
            foreground: { hue: 240, saturation: 10, lightness: 4 },
            primary: { hue: 321, saturation: 100, lightness: 95 },
            primaryForeground: { hue: 321, saturation: 70, lightness: 65 },
            primaryBorder: { hue: 321, saturation: 90, lightness: 90 },
            secondary: { hue: 0, saturation: 0, lightness: 96 },
            secondaryForeground: { hue: 0, saturation: 0, lightness: 9 },
            muted: { hue: 240, saturation: 5, lightness: 96 },
            mutedForeground: { hue: 240, saturation: 4, lightness: 46 },
            accent: { hue: 240, saturation: 5, lightness: 96 },
            accentForeground: { hue: 240, saturation: 6, lightness: 10 },
            border: { hue: 240, saturation: 6, lightness: 90 },
            input: { hue: 240, saturation: 6, lightness: 90 },
            ring: { hue: 240, saturation: 6, lightness: 10 },
            popover: { hue: 0, saturation: 0, lightness: 100 },
            popoverForeground: { hue: 240, saturation: 10, lightness: 4 },
        },
    },
    dark: {
        colors: {
            background: { hue: 0, saturation: 0, lightness: 0 },
            foreground: { hue: 0, saturation: 0, lightness: 98 },
            primary: { hue: 300, saturation: 10, lightness: 5 },
            primaryForeground: { hue: 321, saturation: 70, lightness: 69 },
            primaryBorder: { hue: 321, saturation: 43, lightness: 17 },
            secondary: { hue: 240, saturation: 4, lightness: 16 },
            secondaryForeground: { hue: 0, saturation: 0, lightness: 98 },
            muted: { hue: 240, saturation: 4, lightness: 16 },
            mutedForeground: { hue: 240, saturation: 5, lightness: 65 },
            accent: { hue: 240, saturation: 4, lightness: 16 },
            accentForeground: { hue: 0, saturation: 0, lightness: 98 },
            border: { hue: 240, saturation: 4, lightness: 10 },
            input: { hue: 240, saturation: 4, lightness: 10 },
            ring: { hue: 240, saturation: 5, lightness: 84 },
            popover: { hue: 240, saturation: 10, lightness: 4 },
            popoverForeground: { hue: 0, saturation: 0, lightness: 98 },
        },
    },
};

/**
 * Default user appearance settings.
 */
export const DEFAULT_APPEARANCE: Hikka.UserAppearance = {
    styles: undefined,
    preferences: {
        titleLanguage: 'title_ua',
        nameLanguage: 'name_ua',
    },
    effects: [],
    version: 1,
};

/**
 * Merge two UIStyles objects, with override taking precedence.
 */
export function mergeStyles(
    base: Hikka.UIStyles | undefined,
    override: Hikka.UIStyles | undefined,
): Hikka.UIStyles {
    if (!base && !override) return {};
    if (!base) return override!;
    if (!override) return base;

    return {
        light: {
            colors: {
                ...base.light?.colors,
                ...override.light?.colors,
            },
        },
        dark: {
            colors: {
                ...base.dark?.colors,
                ...override.dark?.colors,
            },
        },
        radius: override.radius ?? base.radius,
    };
}

/**
 * Merge two effect arrays, deduplicating the result.
 */
export function mergeEffects(
    base: Hikka.UIEffect[] | undefined,
    override: Hikka.UIEffect[] | undefined,
): Hikka.UIEffect[] {
    const combined = [...(base ?? []), ...(override ?? [])];
    return [...new Set(combined)];
}
