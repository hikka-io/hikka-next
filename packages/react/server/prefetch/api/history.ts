import {
    followingHistoryOptions,
    userHistoryOptions,
} from '@/options/api/history';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { UseUserHistoryParams } from '@/types/history';

/**
 * Prefetches history of users that the current user follows for server-side rendering
 */
export async function prefetchFollowingHistory({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            followingHistoryOptions(client, { paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches a specific user's history for server-side rendering
 */
export async function prefetchUserHistory({
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseUserHistoryParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            userHistoryOptions(client, { username, paginationArgs }),
        ...rest,
    });
}
