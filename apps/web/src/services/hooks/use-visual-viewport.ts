import { useEffect } from 'react';

type ViewportEvent = 'resize' | 'scroll';

/**
 * Mirrors a measurement of `window.visualViewport` into a CSS variable on the
 * root, throttled to one write per frame, while `enabled`.
 */
function useViewportVar(
    name: string,
    measure: (viewport: VisualViewport) => number,
    events: ViewportEvent[],
    enabled = true,
) {
    useEffect(() => {
        if (!enabled) return;

        const viewport = window.visualViewport;
        if (!viewport) return;

        const root = document.documentElement;
        let rafId = 0;

        const update = () => {
            rafId = 0;
            root.style.setProperty(name, `${measure(viewport)}px`);
        };

        const scheduleUpdate = () => {
            if (!rafId) rafId = requestAnimationFrame(update);
        };

        update();
        for (const event of events) {
            viewport.addEventListener(event, scheduleUpdate, { passive: true });
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            for (const event of events) {
                viewport.removeEventListener(event, scheduleUpdate);
            }
            root.style.removeProperty(name);
        };
    }, [name, enabled, measure, events]);
}

const RESIZE: ViewportEvent[] = ['resize'];
const SCROLL_AND_RESIZE: ViewportEvent[] = ['scroll', 'resize'];

const visibleHeight = (viewport: VisualViewport) => viewport.height;
const offsetTop = (viewport: VisualViewport) => viewport.offsetTop;
// While zoomed (iOS zooms on focus) this also lifts docked UI to the visible bottom, keeping it in view.
const keyboardInset = (viewport: VisualViewport) =>
    Math.max(
        0,
        document.documentElement.clientHeight -
            viewport.height -
            viewport.offsetTop,
    );

/**
 * Sets `--visual-viewport-height` on the root so fixed modals stay visible
 * when the mobile keyboard opens. Listens to `resize` only (not `scroll`);
 * mount once globally.
 */
export function useVisualViewport() {
    useViewportVar('--visual-viewport-height', visibleHeight, RESIZE);
}

/**
 * Sets `--visual-viewport-offset-top` on the root from the viewport scroll
 * offset. Pass `enabled` (e.g. sheet open state) so the listener only runs
 * while visible. Usage: `top: var(--visual-viewport-offset-top, 0px)`.
 */
export function useVisualViewportOffset(enabled: boolean) {
    useViewportVar(
        '--visual-viewport-offset-top',
        offsetTop,
        SCROLL_AND_RESIZE,
        enabled,
    );
}

/**
 * Sets `--keyboard-inset` on the root: how much of the layout viewport the
 * on-screen keyboard covers, for UI docked above it. Usage:
 * `bottom: var(--keyboard-inset, 0px)`.
 */
export function useKeyboardInset(enabled: boolean) {
    useViewportVar(
        '--keyboard-inset',
        keyboardInset,
        SCROLL_AND_RESIZE,
        enabled,
    );
}
