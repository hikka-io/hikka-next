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
    > {
    username: string;
}

/**
 * Hook for getting a user's watch stats
 */
export function useWatchStats(params: UseWatchStatsOptions) {
    const { username, ...options } = params;

    return useQuery(
        queryKeys.watch.stats(username),
        (client) => client.watch.getStats(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export interface PrefetchWatchStatsParams extends UseWatchStatsOptions {
    queryClient: QueryClient;
}

export async function prefetchWatchStats(params: PrefetchWatchStatsParams) {
    const { queryClient, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.watch.stats(username),
        (client) => client.watch.getStats(username),
        options,
    );
}
