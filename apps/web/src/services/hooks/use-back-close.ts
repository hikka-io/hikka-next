import { useCallback, useEffect, useId, useRef } from 'react';

import { useBlocker } from '@tanstack/react-router';

import { useMediaQuery } from '@/services/hooks/use-media-query';

/** Open modals, innermost last. */
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

    // Read through a ref so the blocker keeps a stable identity; `useBlocker`
    // re-registers whenever `shouldBlockFn` changes, which for an inline
    // callback is every keystroke inside the modal.
    const close = useRef(onOpenChange);

    useEffect(() => {
        close.current = onOpenChange;
    });

    useEffect(() => {
        if (!active) return;

        openModals.push(id);

        return () => {
            const index = openModals.indexOf(id);
            if (index !== -1) openModals.splice(index, 1);
        };
    }, [active, id]);

    const shouldBlockFn = useCallback(
        ({ action }: { action: string }) => {
            if (action !== 'BACK') return false;

            // Blockers are consulted in registration order and the first `true`
            // ends the loop, so every modal but the innermost has to decline.
            if (openModals[openModals.length - 1] !== id) return false;

            close.current?.(false);
            return true;
        },
        [id],
    );

    useBlocker({
        disabled: !active,
        // Without this an open modal arms the browser's "Leave site?" prompt.
        enableBeforeUnload: false,
        shouldBlockFn,
    });
}
