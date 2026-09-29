import type { UiStylesOutput, UiSurfaceOverrides } from '@hikka/api';

import { isValidOklch, oklchToCss } from './color';

export const STYLE_ELEMENT_ID = 'user-styles';

/**
 * Surface tokens a user may override directly (the advanced reveal). Excludes
 * the brand-derived `primary*` family and the developer-controlled status
 * colors. Mirrors `UiSurfaceOverrides` from the API.
 */
export const SURFACE_OVERRIDE_TOKENS = new Set<keyof UiSurfaceOverrides>([
    'background',
    'foreground',
    'card',
    'card_foreground',
    'popover',
    'popover_foreground',
    'secondary',
    'secondary_foreground',
    'muted',
    'muted_foreground',
    'accent',
    'accent_foreground',
    'border',
    'input',
    'ring',
]);

/** Convert snake_case/camelCase to kebab-case. */
function keyToKebab(str: string): string {
    return str
        .replace(/_/g, '-')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
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

/** Build `--token: oklch(...)` declarations from a surface-override map. */
function overridesToDecls(
    overrides: UiSurfaceOverrides | null | undefined,
): string[] {
    if (!overrides) return [];

    const decls: string[] = [];
    for (const [key, value] of Object.entries(overrides)) {
        if (!SURFACE_OVERRIDE_TOKENS.has(key as keyof UiSurfaceOverrides)) {
            continue;
        }
        if (!isValidOklch(value)) continue;
        decls.push(`--${keyToKebab(key)}: ${oklchToCss(value)};`);
    }
    return decls;
}

function radiusDeclaration(radius: string | null | undefined): string {
    const sanitized = radius ? sanitizeCSSLength(radius) : undefined;
    if (!sanitized) return '';
    return sanitized === '0rem'
        ? '--radius: 0rem;\n    --base-radius: 0rem;'
        : `--radius: ${sanitized};`;
}

/**
 * Convert UiStylesOutput to a CSS string with `:root:root` (light) and
 * `.dark.dark` (dark) selectors. Only the brand seed, surface overrides and
 * radius are emitted — the derivation lives in globals.css.
 */
export function stylesToCSS(styles: UiStylesOutput | undefined): string {
    if (!styles) return '';

    const parts: string[] = [];

    const brandDecl =
        styles.brand && isValidOklch(styles.brand)
            ? `--brand: ${oklchToCss(styles.brand)};`
            : '';

    const lightDeclarations = [
        brandDecl,
        ...overridesToDecls(styles.overrides?.light),
        radiusDeclaration(styles.radius),
    ].filter(Boolean);

    if (lightDeclarations.length > 0) {
        // :root:root has specificity [0,2,0] vs :root [0,1,0] — wins regardless
        // of source order.
        parts.push(`:root:root {\n    ${lightDeclarations.join('\n    ')}\n}`);
    }

    const darkDeclarations = overridesToDecls(styles.overrides?.dark);
    if (darkDeclarations.length > 0) {
        // .dark.dark has specificity [0,2,0] vs .dark [0,1,0].
        parts.push(`.dark.dark {\n    ${darkDeclarations.join('\n    ')}\n}`);
    }

    return parts.join('\n\n');
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
    } else if (document.head.lastElementChild !== styleElement) {
        // Move to end of <head> so source order favors user styles over any
        // <link rel="stylesheet"> injected by Vite/framework after SSR.
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
 * Convert UiStylesOutput and inject into document (client-side).
 */
export function applyStyles(styles: UiStylesOutput | undefined): void {
    const css = stylesToCSS(styles);

    if (css) {
        injectStyles(css);
    } else {
        removeInjectedStyles();
    }
}
