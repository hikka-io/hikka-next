import { HikkaClientConfig } from '@hikka/client';
import { QueryClient, QueryClientConfig } from '@tanstack/query-core';

import { getHikkaClient, getQueryClient } from '@/core';
import { feedOptions } from '@/options/api/feed';
import { UseFeedParams } from '@/types/feed';

export interface PrefetchFeedParams {
    clientConfig?: HikkaClientConfig;
    queryClientConfig?: QueryClientConfig;
    queryClient?: QueryClient;
}

/**
 * Prefetches feed data for server-side rendering
 */
export async function prefetchFeed({
    args,
    clientConfig,
    queryClientConfig,
    queryClient: queryClientProp,
}: PrefetchFeedParams & UseFeedParams = {}) {
    const queryClient =
        queryClientProp ??
        (queryClientConfig
            ? getQueryClient(queryClientConfig)
            : getQueryClient());
    const hikkaClient = clientConfig
        ? getHikkaClient(clientConfig)
        : getHikkaClient();

    const opts = feedOptions(hikkaClient, { args });

    await queryClient.prefetchInfiniteQuery({
        queryKey: opts.queryKey,
        queryFn: opts.queryFn,
        initialPageParam: opts.initialPageParam,
    });

    return queryClient.getQueryData(opts.queryKey);
}
