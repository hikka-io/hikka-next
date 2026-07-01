import type { OklchColor } from '@hikka/api';

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
export const isValidOklch = (
    color: OklchColor | null | undefined,
): color is OklchColor =>
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
    const toHex = (n: number) =>
        Math.round(n * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};
