import { WatchStatsResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseWatchStatsParams {
    username: string;
}

/**
 * Hook for retrieving watch stats for a user
 */
export function useWatchStats({
    username,
    ...rest
}: UseWatchStatsParams & QueryParams<WatchStatsResponse>) {
    return useQuery({
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getUserWatchStats(username),
        ...rest,
    });
}

/**
 * Prefetches watch stats for a user for server-side rendering
 */
export async function prefetchWatchStats({
    username,
    ...rest
}: PrefetchQueryParams<WatchStatsResponse> & UseWatchStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getUserWatchStats(username),
        ...rest,
    });
}
