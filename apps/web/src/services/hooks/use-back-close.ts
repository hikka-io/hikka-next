import { useBlocker } from '@tanstack/react-router';

import { useMediaQuery } from '@/services/hooks/use-media-query';

/**
 * Closes a controlled modal on browser back navigation instead of leaving
 * the page, on mobile viewports only. Uses the router blocker, so no extra
 * history entries are created and forward navigation from inside the modal
 * is unaffected. No-op for uncontrolled modals (open === undefined).
 */
export function useBackClose(
    open: boolean | undefined,
    onOpenChange: ((open: boolean) => void) | undefined,
) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    useBlocker({
        disabled: isDesktop || open !== true || !onOpenChange,
        shouldBlockFn: ({ action }) => {
            if (action !== 'BACK') return false;

            onOpenChange?.(false);
            return true;
        },
    });
}
