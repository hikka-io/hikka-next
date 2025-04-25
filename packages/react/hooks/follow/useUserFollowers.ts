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

export interface UseFollowersParams {
    username: string;
}

/**
 * Hook for retrieving a user's followers
 */
export function useUserFollowers({
    username,
    paginationArgs,
    ...rest
}: UseFollowersParams & InfiniteQueryParams<FollowListResponse>) {
    return useInfiniteQuery({
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
