import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import {
    FetchQueryOptions,
    QueryClient,
    QueryClientConfig,
} from '@tanstack/query-core';

import { getHikkaClient, getQueryClient } from '@/core';

/**
 * Params for prefetching a query
 */
export interface PrefetchQueryParams<T> {
    /** Query client config */
    queryClientConfig?: QueryClientConfig;
    /** Hikka client config */
    clientConfig?: HikkaClientConfig;
    /** Query options */
    options?: Omit<FetchQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>;
    /** Query client */
    queryClient?: QueryClient;
}

/**
 * Options for prefetching a query
 */
export interface PrefetchQueryOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
> {
    queryKey: TQueryKey;
    queryFn: (client: HikkaClient) => Promise<TQueryFnData>;
    clientConfig?: HikkaClientConfig;
    queryClientConfig?: QueryClientConfig;
    options?: Omit<
        FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >;
    queryClient?: QueryClient;
}

/**
 * Prefetches data for a query and dehydrates it for use in server components.
 *
 * @param queryKey The query key to use
 * @param queryFn The function that will fetch the data
 * @param clientConfig The Hikka client config
 * @param queryClientConfig The query client config
 */
export async function prefetchQuery<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends readonly unknown[] = readonly unknown[],
>({
    queryClientConfig,
    clientConfig,
    queryClient: queryClientProp,
    queryKey,
    queryFn,
    options,
}: PrefetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<
    TData | undefined
> {
    const queryClient =
        queryClientProp ??
        (queryClientConfig
            ? getQueryClient(queryClientConfig)
            : getQueryClient());
    const hikkaClient = clientConfig
        ? getHikkaClient(clientConfig)
        : getHikkaClient();

    // Prefetch the data
    await queryClient.prefetchQuery<TQueryFnData, TError, TData, TQueryKey>({
        queryKey,
        queryFn: () => queryFn(hikkaClient),
        staleTime: options?.staleTime,
        gcTime: options?.gcTime,
    });

    // Return the prefetched data
    return queryClient.getQueryData<TData>(queryKey);
}
