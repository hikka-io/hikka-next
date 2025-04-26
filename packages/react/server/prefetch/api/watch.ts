import {
    UserWatchPaginationResponse,
    WatchPaginationResponse,
    WatchResponse,
    WatchStatsResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseFollowingWatchersParams,
    UseWatchEntryParams,
    UseWatchListParams,
    UseWatchStatsParams,
} from '@/types/watch';

/**
 * Prefetches a user's watch list for server-side rendering
 */
export async function prefetchSearchUserWatches({
    username,
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<WatchPaginationResponse> & UseWatchListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.searchUserWatches(username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches watch stats for a user for server-side rendering
 */
export async function prefetchUserWatchStats({
    username,
    ...rest
}: PrefetchQueryParams<WatchStatsResponse> & UseWatchStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.watch.stats(username),
        queryFn: (client) => client.watch.getUserWatchStats(username),
        ...rest,
    });
}

/**
 * Prefetches a watch entry for server-side rendering
 */
export async function prefetchWatchBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<WatchResponse> & UseWatchEntryParams) {
    return prefetchQuery({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: (client) => client.watch.getWatchBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches users from following list that are watching an anime for server-side rendering
 */
export async function prefetchWatchingUsers({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<UserWatchPaginationResponse> &
    UseFollowingWatchersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getWatchingUsers(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
