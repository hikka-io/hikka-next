import { AnimeWatchSearchArgs, WatchPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseWatchListParams {
    username: string;
    args: AnimeWatchSearchArgs;
}

/**
 * Hook for retrieving a user's watch list
 */
export function useWatchList({
    username,
    args,
    paginationArgs,
    ...rest
}: UseWatchListParams & InfiniteQueryParams<WatchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getList(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a user's watch list for server-side rendering
 */
export async function prefetchWatchList({
    username,
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<WatchPaginationResponse> & UseWatchListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getList(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
