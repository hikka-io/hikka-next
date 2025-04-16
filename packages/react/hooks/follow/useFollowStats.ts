import { FollowStatsResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFollowStatsOptions
    extends Omit<
        UseQueryOptions<
            FollowStatsResponse,
            Error,
            FollowStatsResponse,
            ReturnType<typeof queryKeys.follow.stats>
        >,
        'queryKey' | 'queryFn'
    > {
    username: string;
}

/**
 * Hook for getting follow statistics for a user
 */
export function useFollowStats(params: UseFollowStatsOptions) {
    const { username, ...options } = params;

    return useQuery(
        queryKeys.follow.stats(username),
        (client) => client.follow.getStats(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export interface PrefetchFollowStatsParams extends UseFollowStatsOptions {
    queryClient: QueryClient;
}

export async function prefetchFollowStats(params: PrefetchFollowStatsParams) {
    const { queryClient, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.follow.stats(username),
        (client) => client.follow.getStats(username),
        options,
    );
}
