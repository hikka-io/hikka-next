import { HikkaClient, HikkaClientConfig, PaginationArgs } from '@hikka/client';
import { QueryClientConfig } from '@tanstack/query-core';

import { getHikkaClient, getQueryClient } from '@/core';

/**
 * Params for prefetching infinite queries
 */
export interface PrefetchInfiniteQueryParams<T> {
    /** Pagination arguments */
    paginationArgs?: PaginationArgs;
    /** Hikka client config */
    clientConfig?: HikkaClientConfig;
    /** Query client config */
    queryClientConfig?: QueryClientConfig;
}

/**
 * Options for prefetching an infinite query
 */
export interface PrefetchInfiniteQueryOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
> {
    queryKey: TQueryKey;
    queryFn: (client: HikkaClient, pageParam: number) => Promise<TQueryFnData>;
    clientConfig?: HikkaClientConfig;
    queryClientConfig?: QueryClientConfig;
}

/**
 * Prefetches data for an infinite query and dehydrates it for use in server components.
 *
 * @param queryKey The query key to use
 * @param queryFn The function that will fetch the data
 * @param clientConfig The Hikka client config
 * @param queryClientConfig The query client config
 */
export async function prefetchInfiniteQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryKey,
    queryFn,
    clientConfig,
    queryClientConfig,
}: PrefetchInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
>): Promise<TData | undefined> {
    const queryClient = queryClientConfig
        ? getQueryClient(queryClientConfig)
        : getQueryClient();
    const hikkaClient = clientConfig
        ? getHikkaClient(clientConfig)
        : getHikkaClient();

    // Prefetch the data
    await queryClient.prefetchInfiniteQuery({
        queryKey,
        queryFn: (context) => queryFn(hikkaClient, context.pageParam as number),
        initialPageParam: 1, // Default to page 1
    });

    // Return the prefetched data
    return queryClient.getQueryData<TData>(queryKey);
}
