import { WatchStatsResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving watch stats for a user
 */
export function useWatchStats(
    username: string,
    options?: Omit<
        UseQueryOptions<WatchStatsResponse, Error, WatchStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getStats(username),
        options: options || {},
    });
}

/**
 * Prefetches watch stats for a user for server-side rendering
 */
export async function prefetchWatchStats(
    queryClient: QueryClient,
    username: string,
    options?: Omit<
        FetchQueryOptions<WatchStatsResponse, Error, WatchStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getStats(username),
        options,
    });
}
