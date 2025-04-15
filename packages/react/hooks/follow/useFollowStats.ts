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
    > {}

/**
 * Hook for getting follow statistics for a user
 */
export function useFollowStats(
    username: string,
    options: UseFollowStatsOptions = {},
) {
    return useQuery(
        queryKeys.follow.stats(username),
        (client) => client.follow.getStats(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export async function prefetchFollowStats(
    queryClient: QueryClient,
    username: string,
    options: UseFollowStatsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.follow.stats(username),
        (client) => client.follow.getStats(username),
        options,
    );
}
