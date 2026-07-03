import type { OklchColor, UiStylesOutput } from '@hikka/api';

import { isValidOklch, oklchToCss } from './color';
import { DEFAULT_STYLES } from './defaults';

export const BACKDROP_ATTR = 'data-backdrop';

/**
 * The resolved backdrop the app renders. `intensity` is the user's manual glow
 * strength (0–1); globals.css further scales it down over cover images.
 * `color` overrides the glow hue; when absent the glow follows the brand accent.
 */
export type ResolvedBackdrop = {
    style: 'none' | 'glow';
    intensity: number;
    color?: OklchColor;
};

/** Resolve the backdrop from styles, falling back to the default glow. */
export function resolveBackdrop(
    styles: UiStylesOutput | undefined,
): ResolvedBackdrop {
    const backdrop = styles?.backdrop;
    const style = backdrop?.style ?? DEFAULT_STYLES.backdrop?.style ?? 'glow';
    const rawIntensity =
        backdrop?.intensity ?? DEFAULT_STYLES.backdrop?.intensity ?? 1;
    const color = backdrop?.color;
    return {
        style: style === 'none' ? 'none' : 'glow',
        intensity: Number.isFinite(rawIntensity)
            ? Math.min(1, Math.max(0, rawIntensity))
            : (DEFAULT_STYLES.backdrop?.intensity ?? 1),
        color: isValidOklch(color) ? color : undefined,
    };
}

/**
 * The inline CSS custom properties for a resolved backdrop, shared by the SSR
 * `<html>` style (routes/__root) and the client-side `applyBackdrop` so the
 * variable names and formatting live in one place. `--backdrop-color` is
 * omitted when the glow should follow the brand accent.
 */
export function backdropVars(
    backdrop: ResolvedBackdrop,
): Record<string, string> {
    const vars: Record<string, string> = {
        '--backdrop-intensity': String(backdrop.intensity),
    };
    if (backdrop.color) {
        vars['--backdrop-color'] = oklchToCss(backdrop.color);
    }
    return vars;
}

/** Apply the resolved backdrop to the document root (client-side). */
export function applyBackdrop(backdrop: ResolvedBackdrop): void {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    el.setAttribute(BACKDROP_ATTR, backdrop.style);
    const vars = backdropVars(backdrop);
    el.style.setProperty('--backdrop-intensity', vars['--backdrop-intensity']);
    if (vars['--backdrop-color']) {
        el.style.setProperty('--backdrop-color', vars['--backdrop-color']);
    } else {
        el.style.removeProperty('--backdrop-color');
    }
}
