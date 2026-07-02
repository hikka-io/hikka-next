import type { UiStylesOutput } from '@hikka/api';

import { DEFAULT_STYLES } from './defaults';

export const BACKDROP_ATTR = 'data-backdrop';

/**
 * The resolved backdrop the app renders. `intensity` is the user's manual glow
 * strength (0–1); globals.css further scales it down over cover images.
 */
export type ResolvedBackdrop = {
    style: 'none' | 'glow';
    intensity: number;
};

/** Resolve the backdrop from styles, falling back to the default glow. */
export function resolveBackdrop(
    styles: UiStylesOutput | undefined,
): ResolvedBackdrop {
    const backdrop = styles?.backdrop;
    const style = backdrop?.style ?? DEFAULT_STYLES.backdrop?.style ?? 'glow';
    const rawIntensity =
        backdrop?.intensity ?? DEFAULT_STYLES.backdrop?.intensity ?? 1;
    return {
        style: style === 'none' ? 'none' : 'glow',
        intensity: Math.min(1, Math.max(0, rawIntensity)),
    };
}

/** Apply the resolved backdrop to the document root (client-side). */
export function applyBackdrop(backdrop: ResolvedBackdrop): void {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    el.setAttribute(BACKDROP_ATTR, backdrop.style);
    el.style.setProperty('--backdrop-intensity', String(backdrop.intensity));
}
