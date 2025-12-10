import { HslColor } from 'react-colorful';

/**
 * Convert Hikka HSL color to react-colorful HslColor format.
 */
export const toReactColorful = (
    color: Hikka.HSLColor | undefined,
): HslColor => ({
    h: color?.hue ?? 0,
    s: color?.saturation ?? 0,
    l: color?.lightness ?? 0,
});

/**
 * Convert react-colorful HslColor to Hikka HSLColor format.
 */
export const toHikkaColor = (color: HslColor): Hikka.HSLColor => ({
    hue: Math.round(color.h),
    saturation: Math.round(color.s),
    lightness: Math.round(color.l),
});

/**
 * Format Hikka HSL color as a string (e.g., "321 70% 65%").
 */
export const formatHSL = (color: Hikka.HSLColor | undefined): string | null => {
    if (!color) return null;
    return `${color.hue} ${color.saturation}% ${color.lightness}%`;
};

/**
 * Convert Hikka HSL color to CSS hsl() string.
 */
export const toHSLString = (color: Hikka.HSLColor | undefined): string => {
    if (!color) return 'transparent';
    return `hsl(${color.hue} ${color.saturation}% ${color.lightness}%)`;
};

/**
 * Convert HSL values to hex color string.
 */
export const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Convert hex color string to HSL values.
 */
export const hexToHsl = (hex: string): HslColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
};

