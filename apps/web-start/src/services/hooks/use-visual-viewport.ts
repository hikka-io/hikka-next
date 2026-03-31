'use client';

import { useEffect } from 'react';

/**
 * Tracks `window.visualViewport` height and sets `--visual-viewport-height`
 * on the document root so fixed modals can stay within the visible area
 * when the virtual keyboard opens on mobile.
 *
 * Only listens to `resize` (fires on keyboard open/close), not `scroll`.
 * Mount once globally in providers.
 */
export function useVisualViewport() {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!viewport) return;

        let rafId = 0;

        const update = () => {
            rafId = 0;
            document.documentElement.style.setProperty(
                '--visual-viewport-height',
                `${viewport.height}px`,
            );
        };

        const scheduleUpdate = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        };

        update();
        viewport.addEventListener('resize', scheduleUpdate, { passive: true });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            viewport.removeEventListener('resize', scheduleUpdate);
            document.documentElement.style.removeProperty(
                '--visual-viewport-height',
            );
        };
    }, []);
}

/**
 * Tracks `window.visualViewport` scroll offset and sets
 * `--visual-viewport-offset-top` on the document root.
 *
 * Only activates when `enabled` is true — pass the sheet's open state
 * so the scroll listener is only attached while the sheet is visible.
 * Throttled with requestAnimationFrame.
 *
 * Usage:
 *   useVisualViewportOffset(isSheetOpen);
 *   top: var(--visual-viewport-offset-top, 0px)
 */
export function useVisualViewportOffset(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;

        const viewport = window.visualViewport;
        if (!viewport) return;

        let rafId = 0;

        const update = () => {
            rafId = 0;
            document.documentElement.style.setProperty(
                '--visual-viewport-offset-top',
                `${viewport.offsetTop}px`,
            );
        };

        const scheduleUpdate = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        };

        update();
        viewport.addEventListener('scroll', scheduleUpdate, { passive: true });
        viewport.addEventListener('resize', scheduleUpdate, { passive: true });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            viewport.removeEventListener('scroll', scheduleUpdate);
            viewport.removeEventListener('resize', scheduleUpdate);
            document.documentElement.style.removeProperty(
                '--visual-viewport-offset-top',
            );
        };
    }, [enabled]);
}
