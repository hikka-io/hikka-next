import type { OklchColor, UiStylesOutput } from '@hikka/api';

import { isValidOklch, oklchToCss } from './color';
import { DEFAULT_STYLES } from './defaults';

export const BACKDROP_ATTR = 'data-backdrop';

/**
 * The resolved backdrop the app renders. `intensity` is the user's manual glow
 * strength (0–1); globals.css further scales it down over cover images.
 * `height` is the glow's vertical extent as a 0–1 fraction of the viewport
 * height (1 = full 100vh). `color` overrides the glow hue; when absent the glow
 * follows the brand accent.
 */
export type ResolvedBackdrop = {
    style: 'none' | 'glow';
    intensity: number;
    height: number;
    color?: OklchColor;
};

/** Clamp a raw 0–1 value, falling back to `fallback` when non-finite. */
function clamp01(value: number | undefined, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value)
        ? Math.min(1, Math.max(0, value))
        : fallback;
}

/** Resolve the backdrop from styles, falling back to the default glow. */
export function resolveBackdrop(
    styles: UiStylesOutput | undefined,
): ResolvedBackdrop {
    const backdrop = styles?.backdrop;
    const style = backdrop?.style ?? DEFAULT_STYLES.backdrop?.style ?? 'glow';
    const color = backdrop?.color;
    return {
        style: style === 'none' ? 'none' : 'glow',
        intensity: clamp01(
            backdrop?.intensity,
            DEFAULT_STYLES.backdrop?.intensity ?? 1,
        ),
        height: clamp01(backdrop?.height, DEFAULT_STYLES.backdrop?.height ?? 1),
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
        '--backdrop-height': String(backdrop.height),
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
    el.style.setProperty('--backdrop-height', vars['--backdrop-height']);
    if (vars['--backdrop-color']) {
        el.style.setProperty('--backdrop-color', vars['--backdrop-color']);
    } else {
        el.style.removeProperty('--backdrop-color');
    }
}
