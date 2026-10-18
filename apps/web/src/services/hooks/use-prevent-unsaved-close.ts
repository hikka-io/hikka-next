import { useCallback, useEffect, useRef } from 'react';

import { useBlocker } from '@tanstack/react-router';

import { hasOpenBackCloseModal } from './use-back-close';

type Options = {
    /** Also hold in-app navigation; the returned blocker resolves the prompt. */
    navigation?: boolean;
};

/** Warns before the tab closes while there are unsaved changes. */
export function usePreventUnsavedClose(
    hasUnsavedChanges: boolean,
    { navigation = false }: Options = {},
) {
    const unsaved = useRef(hasUnsavedChanges);

    useEffect(() => {
        unsaved.current = hasUnsavedChanges;
    });

    // Blockers run in registration order and the first `true` wins, so a back
    // press that an open modal will take for closing itself is let through.
    const shouldBlockFn = useCallback(
        ({ action }: { action: string }) =>
            navigation &&
            unsaved.current &&
            !(action === 'BACK' && hasOpenBackCloseModal()),
        [navigation],
    );
    const enableBeforeUnload = useCallback(() => unsaved.current, []);

    return useBlocker({
        shouldBlockFn,
        enableBeforeUnload,
        withResolver: true,
    });
}
