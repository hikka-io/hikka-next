'use client';

import { useEffect } from 'react';

/**
 * Tracks `window.visualViewport` and sets CSS custom properties on the
 * document root so fixed modals can stay within the visible area when
 * the virtual keyboard opens on mobile.
 *
 * Sets:
 *  - `--visual-viewport-height`     (visible area height, in px)
 *  - `--visual-viewport-offset-top` (scroll offset on iOS, in px)
 *
 * Usage on a fixed full-screen sheet:
 *   top: var(--visual-viewport-offset-top, 0px)
 *   height: var(--visual-viewport-height, 100dvh)
 */
export function useVisualViewport() {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!viewport) return;

        const update = () => {
            const root = document.documentElement;
            root.style.setProperty(
                '--visual-viewport-height',
                `${viewport.height}px`,
            );
            root.style.setProperty(
                '--visual-viewport-offset-top',
                `${viewport.offsetTop}px`,
            );
        };

        update();
        viewport.addEventListener('resize', update);
        viewport.addEventListener('scroll', update);

        return () => {
            viewport.removeEventListener('resize', update);
            viewport.removeEventListener('scroll', update);
            document.documentElement.style.removeProperty(
                '--visual-viewport-height',
            );
            document.documentElement.style.removeProperty(
                '--visual-viewport-offset-top',
            );
        };
    }, []);
}
