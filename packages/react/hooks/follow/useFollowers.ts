import { FollowListResponse, PaginationArgs } from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving a user's followers
 */
export function useFollowers(
    username: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            FollowListResponse,
            Error,
            FollowListResponse,
            FollowListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.follow.followers(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowers(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's followers for server-side rendering
 */
export async function prefetchFollowers(
    queryClient: QueryClient,
    username: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            FollowListResponse,
            Error,
            FollowListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.follow.followers(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowers(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
