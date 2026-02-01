import { HSLColor, UIColorTokens, UIStyles } from '@hikka/client';
import type { CSSProperties } from 'react';

export const STYLE_ELEMENT_ID = 'user-styles';

/** Valid color token keys for CSS variable generation. */
const ALLOWED_COLOR_TOKENS = new Set<keyof UIColorTokens>([
    'background',
    'foreground',
    'primary',
    'primary_foreground',
    'primary_border',
    'secondary',
    'secondary_foreground',
    'muted',
    'muted_foreground',
    'accent_foreground',
    'border',
    'ring',
    'popover',
    'popover_foreground',
    'sidebar_background',
    'sidebar_foreground',
    'sidebar_primary',
    'sidebar_primary_foreground',
    'sidebar_accent',
    'sidebar_accent_foreground',
    'sidebar_border',
    'sidebar_ring',
]);

/** Convert snake_case/camelCase to kebab-case. */
function keyToKebab(str: string): string {
    return str
        .replace(/_/g, '-')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

type CSSVarStyle = CSSProperties & Record<string, string | number>;

/** Validate HSL color has finite numbers in valid ranges. */
function isValidHSL(color: HSLColor): boolean {
    return (
        typeof color.h === 'number' &&
        Number.isFinite(color.h) &&
        color.h >= 0 &&
        color.h <= 360 &&
        typeof color.s === 'number' &&
        Number.isFinite(color.s) &&
        color.s >= 0 &&
        color.s <= 100 &&
        typeof color.l === 'number' &&
        Number.isFinite(color.l) &&
        color.l >= 0 &&
        color.l <= 100
    );
}

/** Matches valid CSS length values: 0.5rem, 4px, 1em, 10%, etc. */
const CSS_LENGTH_PATTERN =
    /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|ch|ex|vmin|vmax)$/i;

/** Returns sanitized CSS length or undefined if invalid. */
function sanitizeCSSLength(value: string): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return CSS_LENGTH_PATTERN.test(trimmed) ? trimmed : undefined;
}

/** Matches valid CSS color values: hex, rgb(), rgba(), hsl(), hsla(). */
const CSS_COLOR_PATTERN =
    /^(#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)|hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*(0|1|0?\.\d+))?\s*\))$/i;

/** Returns sanitized CSS color string or undefined if invalid. */
function sanitizeCSSColor(value: string): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return CSS_COLOR_PATTERN.test(trimmed) ? trimmed : undefined;
}

/** Matches valid CSS gradient function names. */
const GRADIENT_FUNCTION_PATTERN =
    /^(linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient)\(/i;

const DANGEROUS_CSS_CHARS = /[{}<>]/;
const STYLE_TAG_PATTERN = /<\/?style/i;
const SCRIPT_TAG_PATTERN = /<\/?script/i;

function hasBalancedParentheses(str: string): boolean {
    let count = 0;
    for (const char of str) {
        if (char === '(') count++;
        if (char === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
}

/** Returns sanitized CSS gradient or undefined if invalid/unsafe. */
function sanitizeCSSGradient(value: string): string | undefined {
    if (typeof value !== 'string') return undefined;

    const trimmed = value.trim();

    if (DANGEROUS_CSS_CHARS.test(trimmed)) return undefined;
    if (STYLE_TAG_PATTERN.test(trimmed)) return undefined;
    if (SCRIPT_TAG_PATTERN.test(trimmed)) return undefined;
    if (!GRADIENT_FUNCTION_PATTERN.test(trimmed)) return undefined;
    if (!hasBalancedParentheses(trimmed)) return undefined;
    if (/url\s*\(/i.test(trimmed)) return undefined;
    if (/expression\s*\(/i.test(trimmed)) return undefined;
    if (/javascript:/i.test(trimmed)) return undefined;

    return trimmed;
}

/** Convert UIColorTokens to CSS variable declarations with sanitization. */
function colorTokensToCSS(tokens: UIColorTokens | undefined): string {
    if (!tokens) return '';

    const declarations: string[] = [];

    for (const [key, value] of Object.entries(tokens)) {
        if (!ALLOWED_COLOR_TOKENS.has(key as keyof UIColorTokens)) continue;
        if (value === undefined || value === null) continue;

        const cssVarName = `--${keyToKebab(key)}`;

        if (typeof value === 'object' && value?.h !== undefined) {
            if (!isValidHSL(value as HSLColor)) continue;
            declarations.push(
                `${cssVarName}: ${value.h} ${value.s}% ${value.l}%;`,
            );
        } else if (typeof value === 'string' && value !== '') {
            const sanitized = sanitizeCSSColor(value);
            if (!sanitized) continue;
            declarations.push(`${cssVarName}: ${sanitized};`);
        }
    }

    return declarations.join('\n    ');
}

/** Convert UIColorTokens to React style object with sanitization. */
function colorTokensToReactStyle(
    tokens: UIColorTokens | undefined,
): CSSVarStyle {
    const style: CSSVarStyle = {};
    if (!tokens) return style;

    for (const [key, value] of Object.entries(tokens)) {
        if (!ALLOWED_COLOR_TOKENS.has(key as keyof UIColorTokens)) continue;
        if (value === undefined || value === null) continue;

        const cssVarName = `--${keyToKebab(key)}`;

        if (typeof value === 'object' && value?.h !== undefined) {
            if (!isValidHSL(value as HSLColor)) continue;
            style[cssVarName] = `${value.h} ${value.s}% ${value.l}%`;
        } else if (typeof value === 'string' && value !== '') {
            const sanitized = sanitizeCSSColor(value);
            if (!sanitized) continue;
            style[cssVarName] = sanitized;
        }
    }

    return style;
}

/** Convert UIStyles to CSS string with :root and .dark selectors. */
export function stylesToCSS(styles: UIStyles | undefined): string {
    if (!styles) return '';

    const parts: string[] = [];
    const lightColors = colorTokensToCSS(styles.light?.colors);
    const sanitizedRadius = styles.radius
        ? sanitizeCSSLength(styles.radius)
        : undefined;
    const radiusDecl = sanitizedRadius ? `--radius: ${sanitizedRadius};` : '';
    const sanitizedLightBg = styles.light?.body?.background_image
        ? sanitizeCSSGradient(styles.light.body.background_image)
        : undefined;

    if (lightColors || radiusDecl) {
        const lightDeclarations = [lightColors, radiusDecl]
            .filter(Boolean)
            .join('\n    ');
        parts.push(`:root {\n    ${lightDeclarations}\n}`);
    }

    if (sanitizedLightBg) {
        parts.push(
            `:root body {\n    background-image: ${sanitizedLightBg};\n}`,
        );
    }

    const darkColors = colorTokensToCSS(styles.dark?.colors);

    if (darkColors) {
        parts.push(`.dark {\n    ${darkColors}\n}`);
    }

    const sanitizedDarkBg = styles.dark?.body?.background_image
        ? sanitizeCSSGradient(styles.dark.body.background_image)
        : undefined;

    if (sanitizedDarkBg) {
        parts.push(
            `.dark body {\n    background-image: ${sanitizedDarkBg};\n}`,
        );
    }

    return parts.join('\n\n');
}

/**
 * Convert UIStyles to React style objects with CSS variables.
 * Returns separate objects for light (root) and dark themes.
 */
export function stylesToReactStyles(styles: UIStyles | undefined): {
    root: CSSVarStyle;
    dark: CSSVarStyle;
} {
    if (!styles) return { root: {}, dark: {} };

    const root: CSSVarStyle = {
        ...colorTokensToReactStyle(styles.light?.colors),
    };

    if (styles.radius) {
        const sanitizedRadius = sanitizeCSSLength(styles.radius);
        if (sanitizedRadius) {
            root['--radius'] = sanitizedRadius;
        }
    }

    const dark: CSSVarStyle = {
        ...colorTokensToReactStyle(styles.dark?.colors),
    };

    return { root, dark };
}

/**
 * Inject CSS into document head. Only use with CSS from stylesToCSS().
 */
export function injectStyles(css: string): void {
    if (typeof document === 'undefined') return;

    let styleElement = document.getElementById(
        STYLE_ELEMENT_ID,
    ) as HTMLStyleElement | null;

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = STYLE_ELEMENT_ID;
        document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
}

/**
 * Remove custom styles element from document.
 */
export function removeInjectedStyles(): void {
    if (typeof document === 'undefined') return;

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    if (styleElement) {
        styleElement.remove();
    }
}

/**
 * Convert UIStyles and inject into document (client-side).
 */
export function applyStyles(styles: UIStyles | undefined): void {
    const css = stylesToCSS(styles);

    if (css) {
        injectStyles(css);
    } else {
        removeInjectedStyles();
    }
}
