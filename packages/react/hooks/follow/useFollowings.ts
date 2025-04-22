import { FollowListResponse, PaginationArgs } from '@hikka/client';
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
 * Hook for retrieving a user's followings
 */
export function useFollowings(
    username: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            FollowListResponse,
            Error,
            InfiniteData<FollowListResponse>,
            FollowListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's followings for server-side rendering
 */
export async function prefetchFollowings(
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
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
