'use client';

import { useVisualViewport } from '@/services/hooks/use-visual-viewport';

/**
 * Sets `--visual-viewport-height` CSS variable on the document root,
 * updating on virtual keyboard show/hide. Mount once in providers.
 */
export default function VisualViewportSyncer() {
    useVisualViewport();
    return null;
}
