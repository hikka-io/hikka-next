import { HistoryPaginationResponse, PaginationArgs } from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving history of users that the current user follows
 */
export function useFollowingHistory(
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            HistoryPaginationResponse,
            Error,
            InfiniteData<HistoryPaginationResponse>,
            HistoryPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.history.following(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getFollowingHistory({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches history of users that the current user follows for server-side rendering
 */
export async function prefetchFollowingHistory(
    queryClient: QueryClient,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            HistoryPaginationResponse,
            Error,
            HistoryPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.history.following(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getFollowingHistory({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
