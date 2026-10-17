import { useEffect, useEffectEvent } from 'react';

import { useNavigate, useRouterState } from '@tanstack/react-router';

/** Hands a shared link's `focus` slug to the graph once, then drops it from the URL. */
export function useSharedFocus(onFocus: (slug: string) => void) {
    const focus = useRouterState({
        select: (state) => state.location.search.focus,
    });
    const navigate = useNavigate();
    const consume = useEffectEvent((slug: string) => onFocus(slug));

    useEffect(() => {
        if (!focus) return;

        consume(focus);
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, focus: undefined }),
            replace: true,
            resetScroll: false,
        });
    }, [focus, navigate]);
}
