/**
 * Inline CSS variables used for instant previews in the appearance settings.
 * They are set directly on <html> so they win over the injected user
 * stylesheet; every commit path must clear them (via `setLiveVar(name, null)`
 * or `clearLivePreview`) so the injected styles become the source of truth
 * again.
 */
const LIVE_PREVIEW_VARS = [
    '--brand',
    '--backdrop-intensity',
    '--backdrop-height',
    '--backdrop-color',
] as const;

export type LivePreviewVar = (typeof LIVE_PREVIEW_VARS)[number];

/** Set (or remove, with `null`) a live-preview var on the document root. */
export function setLiveVar(name: LivePreviewVar, value: string | null): void {
    if (typeof document === 'undefined') return;
    const style = document.documentElement.style;
    if (value === null) style.removeProperty(name);
    else style.setProperty(name, value);
}

/** Remove every live-preview var (used by the reset button). */
export function clearLivePreview(): void {
    for (const name of LIVE_PREVIEW_VARS) setLiveVar(name, null);
}
