import type { HslColor } from 'react-colorful';

import type { HslColor as HikkaHslColor, OklchColor } from '@hikka/api';

/**
 * Convert Hikka HSL color to react-colorful HslColor format.
 */
export const toReactColorful = (
    color: HikkaHslColor | null | undefined,
): HslColor => ({
    h: color?.h ?? 0,
    s: color?.s ?? 0,
    l: color?.l ?? 0,
});

/**
 * Convert react-colorful HslColor to Hikka HslColor format.
 */
export const toHikkaColor = (color: HslColor): HikkaHslColor => ({
    h: Math.round(color.h),
    s: Math.round(color.s),
    l: Math.round(color.l),
});

/**
 * Format Hikka HSL color as a string (e.g., "321 70% 65%").
 */
export const formatHSL = (
    color: HikkaHslColor | null | undefined,
): string | null => {
    if (!color) return null;
    return `${color.h} ${color.s}% ${color.l}%`;
};

/**
 * Convert Hikka HSL color to CSS hsl() string.
 */
export const toHSLString = (
    color: HikkaHslColor | null | undefined,
): string => {
    if (!color) return 'transparent';
    return `hsl(${color.h} ${color.s}% ${color.l}%)`;
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
        return hex.length === 1 ? `0${hex}` : hex;
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

/* ------------------------------------------------------------------ */
/* OKLCH                                                               */
/* ------------------------------------------------------------------ */

const round = (value: number, digits: number): number => {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** Format a number without trailing zeros (0.7 → "0.7", 343 → "343"). */
const trim = (value: number): string => String(round(value, 4));

const srgbToLinear = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (c: number): number =>
    c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return [f(0), f(8), f(4)];
};

const rgbToOklch = (r: number, g: number, b: number): OklchColor => {
    const lr = srgbToLinear(r);
    const lg = srgbToLinear(g);
    const lb = srgbToLinear(b);

    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    let h = (Math.atan2(bb, a) * 180) / Math.PI;
    if (h < 0) h += 360;

    return { l: round(L, 3), c: round(Math.hypot(a, bb), 3), h: round(h, 1) };
};

const oklchToRgb = ({ l, c, h }: OklchColor): [number, number, number] => {
    const hr = (h * Math.PI) / 180;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.291485548 * b;

    const L = l_ ** 3;
    const M = m_ ** 3;
    const S = s_ ** 3;

    const r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
    const g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
    const bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

    return [
        clamp01(linearToSrgb(r)),
        clamp01(linearToSrgb(g)),
        clamp01(linearToSrgb(bl)),
    ];
};

/** Validate an OklchColor: l∈[0,1], c∈[0,0.4], h∈[0,360], all finite. */
export const isValidOklch = (color: OklchColor | null | undefined): boolean =>
    !!color &&
    Number.isFinite(color.l) &&
    color.l >= 0 &&
    color.l <= 1 &&
    Number.isFinite(color.c) &&
    color.c >= 0 &&
    color.c <= 0.4 &&
    Number.isFinite(color.h) &&
    color.h >= 0 &&
    color.h <= 360;

/** Format an OklchColor as a CSS `oklch(l c h)` string. */
export const oklchToCss = ({ l, c, h }: OklchColor): string =>
    `oklch(${trim(l)} ${trim(c)} ${trim(h)})`;

/** Convert a Hikka HSL color to OKLCH. */
export const hslToOklch = (color: HikkaHslColor): OklchColor => {
    const [r, g, b] = hslToRgb(color.h, color.s, color.l);
    return rgbToOklch(r, g, b);
};

/** Convert a `#rrggbb` hex string to OKLCH (null if malformed). */
export const hexToOklch = (hex: string): OklchColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return rgbToOklch(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
    );
};

/** Convert an OklchColor to an uppercase `#RRGGBB` hex string. */
export const oklchToHex = (color: OklchColor): string => {
    const [r, g, b] = oklchToRgb(color);
    const toHex = (n: number) => {
        const hex = Math.round(n * 255)
            .toString(16)
            .padStart(2, '0');
        return hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};
