import { HistoryPaginationResponse } from '@hikka/client';

import { queryKeys } from '@/core';
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
}: PrefetchInfiniteQueryParams<HistoryPaginationResponse> = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.history.following(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getFollowingHistory({
                page,
                size: paginationArgs?.size,
            }),
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
}: PrefetchInfiniteQueryParams<HistoryPaginationResponse> &
    UseUserHistoryParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
