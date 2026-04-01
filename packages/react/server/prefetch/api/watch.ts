import {
    searchUserWatchesOptions,
    userWatchStatsOptions,
    watchBySlugOptions,
    watchingUsersOptions,
} from '@/options/api/watch';
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
}: PrefetchInfiniteQueryParams & UseWatchListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchUserWatchesOptions(client, {
                username,
                args,
                paginationArgs,
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
}: PrefetchQueryParams & UseWatchStatsParams) {
    return prefetchQuery({
        optionsFactory: (client) => userWatchStatsOptions(client, { username }),
        ...rest,
    });
}

/**
 * Prefetches a watch entry for server-side rendering
 */
export async function prefetchWatchBySlug({
    slug,
    ...rest
}: PrefetchQueryParams & UseWatchEntryParams) {
    return prefetchQuery({
        optionsFactory: (client) => watchBySlugOptions(client, { slug }),
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
}: PrefetchInfiniteQueryParams & UseFollowingWatchersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            watchingUsersOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}
