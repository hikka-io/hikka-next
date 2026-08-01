import { useEffect, useId } from 'react';

import { useBlocker } from '@tanstack/react-router';

import { useMediaQuery } from '@/services/hooks/use-media-query';

/**
 * Open modals, innermost last. Back must dismiss only the top one, or a
 * preset opened from the preset list takes the list down with it.
 */
const openModals: string[] = [];

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
    const id = useId();
    const active = !isDesktop && open === true && !!onOpenChange;

    useEffect(() => {
        if (!active) return;

        openModals.push(id);

        return () => {
            const index = openModals.indexOf(id);
            if (index !== -1) openModals.splice(index, 1);
        };
    }, [active, id]);

    useBlocker({
        disabled: !active,
        shouldBlockFn: ({ action }) => {
            if (action !== 'BACK') return false;

            if (openModals[openModals.length - 1] === id) {
                onOpenChange?.(false);
            }

            return true;
        },
    });
}
