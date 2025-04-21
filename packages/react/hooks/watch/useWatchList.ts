import {
    AnimeWatchSearchArgs,
    PaginationArgs,
    WatchPaginationResponse,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving a user's watch list
 */
export function useWatchList(
    username: string,
    args: AnimeWatchSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            WatchPaginationResponse,
            Error,
            WatchPaginationResponse,
            WatchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getList(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's watch list for server-side rendering
 */
export async function prefetchWatchList(
    queryClient: QueryClient,
    username: string,
    args: AnimeWatchSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            WatchPaginationResponse,
            Error,
            WatchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getList(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
