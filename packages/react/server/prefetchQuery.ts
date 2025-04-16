import { HikkaClient } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';

import { getHikkaClient } from './createHikkaClient';

/**
 * Prefetches data for a query and dehydrates it for use in server components.
 *
 * @param queryClient The query client to use
 * @param queryKey The query key to use
 * @param queryFn The function that will fetch the data
 * @param options Additional options for the query
 */
export async function prefetchQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>(
    queryClient: QueryClient,
    queryKey: TQueryKey,
    queryFn: (client: HikkaClient) => Promise<TQueryFnData>,
    options?: Omit<
        FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >,
): Promise<void> {
    const hikkaClient = getHikkaClient();

    // Prefetch the data
    await queryClient.prefetchQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: () => queryFn(hikkaClient),
        staleTime: options?.staleTime,
        gcTime: options?.gcTime,
    });
}
