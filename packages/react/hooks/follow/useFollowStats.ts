import { FollowStatsResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving follow stats for a user
 */
export function useFollowStats(
    username: string,
    options?: Omit<
        UseQueryOptions<FollowStatsResponse, Error, FollowStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getStats(username),
        options: options || {},
    });
}

/**
 * Prefetches follow stats for server-side rendering
 */
export async function prefetchFollowStats(
    queryClient: QueryClient,
    username: string,
    options?: Omit<
        FetchQueryOptions<FollowStatsResponse, Error, FollowStatsResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getStats(username),
        options,
    });
}
