import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import { QueryClient, QueryClientConfig } from '@tanstack/query-core';

import { getHikkaClient, getQueryClient } from '@/core';

/**
 * Params for prefetching a query
 */
export interface PrefetchQueryParams {
    /** Query client config */
    queryClientConfig?: QueryClientConfig;
    /** Hikka client config */
    clientConfig?: HikkaClientConfig;
    /** Query client */
    queryClient?: QueryClient;
}

/**
 * Prefetches data for a query and dehydrates it for use in server components.
 */
export async function prefetchQuery<TData>({
    queryClientConfig,
    clientConfig,
    queryClient: queryClientProp,
    optionsFactory,
}: PrefetchQueryParams & {
    optionsFactory: (
        client: HikkaClient,
    ) => {
        queryKey: readonly unknown[];
        queryFn?: (...args: any[]) => TData | Promise<TData>;
    };
}): Promise<Awaited<TData> | undefined> {
    const queryClient =
        queryClientProp ??
        (queryClientConfig
            ? getQueryClient(queryClientConfig)
            : getQueryClient());
    const hikkaClient = clientConfig
        ? getHikkaClient(clientConfig)
        : getHikkaClient();

    const opts = optionsFactory(hikkaClient);

    await queryClient.prefetchQuery(opts);

    return queryClient.getQueryData<Awaited<TData>>(opts.queryKey);
}
