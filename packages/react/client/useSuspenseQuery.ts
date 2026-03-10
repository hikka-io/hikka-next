'use client';

import {
    UseSuspenseQueryOptions,
    UseSuspenseQueryResult,
    useSuspenseQuery as useTanstackSuspenseQuery,
} from '@tanstack/react-query';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { addDeepTitleProperties } from '@/utils';

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
    const { defaultOptions } = useHikkaClient();

    return useTanstackSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: queryFn!,
        ...options,
        select: options?.select
            ? (data) =>
                  options.select!(
                      addDeepTitleProperties(
                          data,
                          defaultOptions?.title,
                          defaultOptions?.name,
                      ),
                  )
            : (data) =>
                  addDeepTitleProperties(
                      data,
                      defaultOptions?.title,
                      defaultOptions?.name,
                  ) as unknown as TData,
    });
}
