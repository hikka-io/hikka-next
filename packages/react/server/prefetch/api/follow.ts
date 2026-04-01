import {
    followStatusOptions,
    userFollowStatsOptions,
    userFollowersOptions,
    userFollowingsOptions,
} from '@/options/api/follow';
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
}: PrefetchQueryParams & UseFollowStatusParams) {
    return prefetchQuery({
        optionsFactory: (client) => followStatusOptions(client, { username }),
        ...rest,
    });
}

/**
 * Prefetches follow stats for server-side rendering
 */
export async function prefetchUserFollowStats({
    username,
    ...rest
}: PrefetchQueryParams & UseFollowStatsParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            userFollowStatsOptions(client, { username }),
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
}: PrefetchInfiniteQueryParams & UseFollowersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            userFollowersOptions(client, { username, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseFollowingsParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            userFollowingsOptions(client, { username, paginationArgs }),
        ...rest,
    });
}
