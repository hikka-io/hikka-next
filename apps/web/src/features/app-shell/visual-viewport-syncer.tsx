import { useVisualViewport } from '@/services/hooks/use-visual-viewport';

/** Sets `--visual-viewport-height` on the document root. Mount once in providers. */
export default function VisualViewportSyncer() {
    useVisualViewport();
    return null;
}
