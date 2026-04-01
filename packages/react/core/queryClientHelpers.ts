import { QueryClient } from '@tanstack/react-query';

/**
 * Type-safe wrapper around queryClient.ensureInfiniteQueryData.
 *
 * infiniteQueryOptions() returns UseInfiniteQueryOptions which is structurally
 * incompatible with FetchInfiniteQueryOptions expected by ensureInfiniteQueryData.
 * This helper centralizes the necessary type cast.
 */
export function ensureInfiniteQueryData<T>(
    queryClient: QueryClient,
    options: T,
) {
    return queryClient.ensureInfiniteQueryData(options as any);
}

/**
 * Type-safe wrapper around queryClient.prefetchInfiniteQuery.
 *
 * Same type mismatch as ensureInfiniteQueryData — centralizes the cast.
 */
export function prefetchInfiniteQuery<T>(queryClient: QueryClient, options: T) {
    return queryClient.prefetchInfiniteQuery(options as any);
}
