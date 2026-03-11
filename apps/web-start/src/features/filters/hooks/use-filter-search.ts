'use client';

import { useRouterState } from '@tanstack/react-router';

/**
 * Route-agnostic hook to read parsed search params from TanStack Router state.
 * Replaces useSearchParams().getAll() / .get() pattern in filter components.
 */
export function useFilterSearch<
    T extends Record<string, unknown> = Record<string, unknown>,
>(): T {
    return useRouterState({
        select: (state) => state.location.search as T,
    });
}

export default useFilterSearch;
