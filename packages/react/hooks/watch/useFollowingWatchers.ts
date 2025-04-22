import { PaginationArgs, UserWatchPaginationResponse } from '@hikka/client';
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
 * Hook for retrieving users from following list that are watching an anime
 */
export function useFollowingWatchers(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            UserWatchPaginationResponse,
            Error,
            InfiniteData<UserWatchPaginationResponse>,
            UserWatchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getFollowingUsers(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches users from following list that are watching an anime for server-side rendering
 */
export async function prefetchFollowingWatchers(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            UserWatchPaginationResponse,
            Error,
            UserWatchPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getFollowingUsers(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
