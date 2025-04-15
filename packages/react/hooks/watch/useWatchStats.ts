import { WatchStatsResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseWatchStatsOptions
    extends Omit<
        UseQueryOptions<
            WatchStatsResponse,
            Error,
            WatchStatsResponse,
            ReturnType<typeof queryKeys.watch.stats>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting a user's watch stats
 */
export function useWatchStats(
    username: string,
    options: UseWatchStatsOptions = {},
) {
    return useQuery(
        queryKeys.watch.stats(username),
        (client) => client.watch.getStats(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export async function prefetchWatchStats(
    queryClient: QueryClient,
    username: string,
    options: UseWatchStatsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.watch.stats(username),
        (client) => client.watch.getStats(username),
        options,
    );
}
