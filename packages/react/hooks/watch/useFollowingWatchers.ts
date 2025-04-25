import { UserWatchPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseFollowingWatchersParams {
    slug: string;
}

/**
 * Hook for retrieving users from following list that are watching an anime
 */
export function useFollowingWatchers({
    slug,
    paginationArgs,
    options,
    ...rest
}: UseFollowingWatchersParams &
    InfiniteQueryParams<UserWatchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.watch.getWatchingUsers(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Prefetches users from following list that are watching an anime for server-side rendering
 */
export async function prefetchFollowingWatchers({
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
