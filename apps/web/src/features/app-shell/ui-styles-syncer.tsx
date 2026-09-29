import { useEffect } from 'react';

import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { applyBackdrop, applyStyles } from '@/utils/customization';

/**
 * Injects user UI styles as CSS variables and applies the backdrop attribute.
 * Runs continuously so live edits (and cross-tab changes) take effect.
 */
export default function UIStylesSyncer() {
    const { mergedStyles, backdrop } = useSessionUI();

    useEffect(() => {
        applyStyles(mergedStyles);
    }, [mergedStyles]);

    useEffect(() => {
        applyBackdrop(backdrop);
    }, [backdrop]);

    return null;
}
