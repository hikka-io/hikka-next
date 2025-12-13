import type { CSSProperties } from 'react';

export const STYLE_ELEMENT_ID = 'user-styles';

function camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

type CSSVarStyle = CSSProperties & Record<string, string | number>;

/**
 * Convert UIColorTokens to CSS variable declarations
 */
function colorTokensToCSS(tokens: Hikka.UIColorTokens | undefined): string {
    if (!tokens) return '';

    const declarations: string[] = [];

    for (const [key, value] of Object.entries(tokens)) {
        if (value !== undefined && value !== null) {
            if (typeof value === 'object' && value?.h !== undefined) {
                const cssVarName = `--${camelToKebab(key)}`;
                declarations.push(
                    `${cssVarName}: ${value.h} ${value.s}% ${value.l}%;`,
                );
            } else if (typeof value === 'string' && value !== '') {
                const cssVarName = `--${camelToKebab(key)}`;
                declarations.push(`${cssVarName}: ${value};`);
            }
        }
    }

    return declarations.join('\n    ');
}

/**
 * Convert UIColorTokens to a React style object with CSS variables.
 */
function colorTokensToReactStyle(
    tokens: Hikka.UIColorTokens | undefined,
): CSSVarStyle {
    const style: CSSVarStyle = {};
    if (!tokens) return style;

    for (const [key, value] of Object.entries(tokens)) {
        if (value !== undefined && value !== null) {
            const cssVarName = `--${camelToKebab(key)}`;

            if (typeof value === 'object' && value?.h !== undefined) {
                style[cssVarName] = `${value.h} ${value.s}% ${value.l}%`;
            } else if (typeof value === 'string' && value !== '') {
                style[cssVarName] = value;
            }
        }
    }

    return style;
}

/**
 * Convert UIStyles to a complete CSS string with :root and .dark selectors
 */
export function stylesToCSS(styles: Hikka.UIStyles | undefined): string {
    if (!styles) return '';

    const parts: string[] = [];

    const lightColors = colorTokensToCSS(styles.light?.colors);
    const radiusDecl = styles.radius ? `--radius: ${styles.radius};` : '';

    if (lightColors || radiusDecl) {
        const lightDeclarations = [lightColors, radiusDecl]
            .filter(Boolean)
            .join('\n    ');
        parts.push(`:root {\n    ${lightDeclarations}\n}`);
    }

    const darkColors = colorTokensToCSS(styles.dark?.colors);

    if (darkColors) {
        parts.push(`.dark {\n    ${darkColors}\n}`);
    }

    return parts.join('\n\n');
}

/**
 * Convert UIStyles to React "style" objects (CSS variables).
 *
 * Note: inline styles can't target selectors like ".dark", so we return both
 * buckets for the caller to apply conditionally.
 */
export function stylesToReactStyles(styles: Hikka.UIStyles | undefined): {
    root: CSSVarStyle;
    dark: CSSVarStyle;
} {
    if (!styles) return { root: {}, dark: {} };

    const root: CSSVarStyle = {
        ...colorTokensToReactStyle(styles.light?.colors),
    };

    if (styles.radius) {
        root['--radius'] = styles.radius;
    }

    const dark: CSSVarStyle = {
        ...colorTokensToReactStyle(styles.dark?.colors),
    };

    return { root, dark };
}

/**
 * Inject CSS styles into the document head.
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
 * Remove the custom styles element from the document.
 */
export function removeInjectedStyles(): void {
    if (typeof document === 'undefined') return;

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    if (styleElement) {
        styleElement.remove();
    }
}

/**
 * Convert UIStyles and inject them.
 */
export function applyStyles(styles: Hikka.UIStyles | undefined): void {
    const css = stylesToCSS(styles);

    if (css) {
        injectStyles(css);
    } else {
        removeInjectedStyles();
    }
}
