'use client';

import {
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
    useSuspenseQuery as useTanstackSuspenseQuery,
} from '@tanstack/react-query';


/**
 * Hook for creating suspense queries with the Hikka client.
 * Use this when data is guaranteed to be in cache (e.g., pre-loaded via route loader).
 * Unlike useQuery, data is never undefined and loading states are handled by Suspense boundaries.
 */
export function useSuspenseQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryKey,
    queryFn,
    options,
}: {
    queryKey: TQueryKey;
    queryFn?: (...args: any[]) => TQueryFnData | Promise<TQueryFnData>;
    options?: Omit<
        UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >;
}): UseSuspenseQueryResult<TData, TError> {
    return useTanstackSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: queryFn!,
        ...options,
    });
}
