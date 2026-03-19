'use client';

import { useEffect } from 'react';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { applyStyles } from '@/utils/ui/inject-styles';

/**
 * Watches TanStack Query user UI data and injects CSS variables
 * into the document. Runs continuously — the color editor modal
 * uses inline styles on the preview card only and does not
 * interfere with this global syncer.
 */
export default function UIStylesSyncer() {
    const { mergedStyles } = useSessionUI();

    useEffect(() => {
        applyStyles(mergedStyles);
    }, [mergedStyles]);

    return null;
}
