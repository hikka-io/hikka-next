'use client';

import { useVisualViewport } from '@/services/hooks/use-visual-viewport';

/**
 * Sets `--visual-viewport-height` on the document root via resize listener.
 * Mount once in providers. Scroll-based offset tracking is handled locally
 * by components that need it via `useVisualViewportOffset`.
 */
export default function VisualViewportSyncer() {
    useVisualViewport();
    return null;
}
