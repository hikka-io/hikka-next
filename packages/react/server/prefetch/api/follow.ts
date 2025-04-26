import {
    FollowListResponse,
    FollowResponse,
    FollowStatsResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseFollowStatsParams,
    UseFollowStatusParams,
    UseFollowersParams,
    UseFollowingsParams,
} from '@/types/follow';

/**
 * Prefetches follow status for server-side rendering
 */
export async function prefetchFollowStatus({
    username,
    ...rest
}: PrefetchQueryParams<FollowResponse> & UseFollowStatusParams) {
    return prefetchQuery({
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.getFollowStatus(username),
        ...rest,
    });
}

/**
 * Prefetches follow stats for server-side rendering
 */
export async function prefetchUserFollowStats({
    username,
    ...rest
}: PrefetchQueryParams<FollowStatsResponse> & UseFollowStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.follow.stats(username),
        queryFn: (client) => client.follow.getUserFollowStats(username),
        ...rest,
    });
}

/**
 * Prefetches a user's followers for server-side rendering
 */
export async function prefetchUserFollowers({
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<FollowListResponse> & UseFollowersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.follow.followers(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getUserFollowers(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a user's followings for server-side rendering
 */
export async function prefetchUserFollowings({
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<FollowListResponse> & UseFollowingsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getUserFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
