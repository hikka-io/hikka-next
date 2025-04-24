import { FollowStatsResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseFollowStatsParams {
    username: string;
}

/**
 * Hook for retrieving follow stats for a user
 */
export function useFollowStats({
    username,
    ...rest
}: UseFollowStatsParams & QueryParams<FollowStatsResponse>) {
    return useQuery({
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getStats(username),
        ...rest,
    });
}

/**
 * Prefetches follow stats for server-side rendering
 */
export async function prefetchFollowStats({
    username,
    ...rest
}: PrefetchQueryParams<FollowStatsResponse> & UseFollowStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getStats(username),
        ...rest,
    });
}
