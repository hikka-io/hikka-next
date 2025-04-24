import { HistoryPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving history of users that the current user follows
 */
export function useFollowingHistory({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<HistoryPaginationResponse> = {}) {
    return useInfiniteQuery({
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
