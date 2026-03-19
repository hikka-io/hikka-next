'use client';

import { useEffect } from 'react';

import { useSessionUI } from '@/services/hooks/use-session-ui';
import { applyStyles } from '@/utils/ui/inject-styles';

/**
 * Module-level counter to pause global style syncing while the
 * CustomColorsModal is doing live CSS preview.
 * Uses a counter (not boolean) for React Strict Mode safety where
 * effects may mount/unmount/remount.
 */
let editingCount = 0;

export function setStylesEditing(editing: boolean) {
    editingCount += editing ? 1 : -1;
}

export function getStylesEditing() {
    return editingCount > 0;
}

/**
 * Watches TanStack Query user UI data and injects CSS variables
 * into the document. Skips updates while isEditing is true
 * (the color editor modal takes over CSS injection during editing).
 */
export default function UIStylesSyncer() {
    const { mergedStyles } = useSessionUI();

    useEffect(() => {
        if (!getStylesEditing()) {
            applyStyles(mergedStyles);
        }
    }, [mergedStyles]);

    return null;
}
