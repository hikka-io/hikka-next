'use client';

import { useEffect } from 'react';

/**
 * Tracks `window.visualViewport` size and sets a CSS custom property
 * `--visual-viewport-height` on the document root. This allows
 * fixed/sticky elements (like editor toolbars inside modals) to stay
 * visible above the virtual keyboard on mobile devices.
 *
 * Usage in CSS/Tailwind: `h-[var(--visual-viewport-height,100dvh)]`
 */
export function useVisualViewport() {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!viewport) return;

        const update = () => {
            document.documentElement.style.setProperty(
                '--visual-viewport-height',
                `${viewport.height}px`,
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
        };
    }, []);
}
