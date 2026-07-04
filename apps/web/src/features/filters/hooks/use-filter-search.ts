import { useRouterState } from '@tanstack/react-router';

/** Route-agnostic hook to read parsed search params from TanStack Router state. */
export function useFilterSearch<
    T extends Record<string, unknown> = Record<string, unknown>,
>(): T {
    return useRouterState({
        select: (state) => (state.resolvedLocation ?? state.location).search,
    }) as unknown as T;
}

export default useFilterSearch;
