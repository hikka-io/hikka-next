import { FollowListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseFollowingsParams {
    username: string;
}

/**
 * Hook for retrieving a user's followings
 */
export function useFollowings({
    username,
    paginationArgs,
    ...rest
}: UseFollowingsParams & InfiniteQueryParams<FollowListResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a user's followings for server-side rendering
 */
export async function prefetchFollowings({
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<FollowListResponse> & UseFollowingsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.follow.getFollowings(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
