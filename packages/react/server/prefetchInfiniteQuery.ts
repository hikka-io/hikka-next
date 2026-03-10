import { HikkaClient, HikkaClientConfig, PaginationArgs } from '@hikka/client';
import {
    InfiniteData,
    QueryClient,
    QueryClientConfig,
} from '@tanstack/query-core';

import { getHikkaClient, getQueryClient } from '@/core';

/**
 * Params for prefetching infinite queries
 */
export interface PrefetchInfiniteQueryParams {
    /** Pagination arguments */
    paginationArgs?: PaginationArgs;
    /** Hikka client config */
    clientConfig?: HikkaClientConfig;
    /** Query client config */
    queryClientConfig?: QueryClientConfig;
    /** Query client */
    queryClient?: QueryClient;
}

/**
 * Prefetches data for an infinite query and dehydrates it for use in server components.
 */
export async function prefetchInfiniteQuery<TData>({
    clientConfig,
    queryClientConfig,
    queryClient: queryClientProp,
    optionsFactory,
}: PrefetchInfiniteQueryParams & {
    optionsFactory: (
        client: HikkaClient,
    ) => {
        queryKey: readonly unknown[];
        queryFn?: (...args: any[]) => TData | Promise<TData>;
        initialPageParam: number;
    };
}): Promise<InfiniteData<Awaited<TData>> | undefined> {
    const queryClient =
        queryClientProp ??
        (queryClientConfig
            ? getQueryClient(queryClientConfig)
            : getQueryClient());
    const hikkaClient = clientConfig
        ? getHikkaClient(clientConfig)
        : getHikkaClient();

    const opts = optionsFactory(hikkaClient);

    await queryClient.prefetchInfiniteQuery({
        queryKey: opts.queryKey,
        queryFn: opts.queryFn,
        initialPageParam: opts.initialPageParam,
    });

    return queryClient.getQueryData<InfiniteData<Awaited<TData>>>(opts.queryKey);
}
