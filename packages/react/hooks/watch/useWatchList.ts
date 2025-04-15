import { AnimeWatchSearchArgs, WatchPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseWatchListOptions
    extends Omit<
        UseQueryOptions<
            WatchPaginationResponse,
            Error,
            WatchPaginationResponse,
            ReturnType<typeof queryKeys.watch.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's watch list
 */
export function useWatchList(
    username: string,
    args: AnimeWatchSearchArgs,
    options: UseWatchListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.watch.list(username, { ...args, page, size }),
        (client) => client.watch.getList(username, args, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export async function prefetchWatchList(
    queryClient: QueryClient,
    username: string,
    args: AnimeWatchSearchArgs,
    options: UseWatchListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.watch.list(username, { ...args, page, size }),
        (client) => client.watch.getList(username, args, page, size),
        queryOptions,
    );
}
