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
 * Hook for retrieving a specific user's history
 */
export function useUserHistory(
    username: string,
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
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a specific user's history for server-side rendering
 */
export async function prefetchUserHistory(
    queryClient: QueryClient,
    username: string,
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
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
