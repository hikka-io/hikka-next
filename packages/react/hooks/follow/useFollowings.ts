import { FollowListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFollowingsOptions
    extends Omit<
        UseQueryOptions<
            FollowListResponse,
            Error,
            FollowListResponse,
            ReturnType<typeof queryKeys.follow.following>
        >,
        'queryKey' | 'queryFn'
    > {
    username: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's followings
 */
export function useFollowings(params: UseFollowingsOptions) {
    const { username, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.follow.following(username),
        (client) => client.follow.getFollowings(username, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export interface PrefetchFollowingsParams extends UseFollowingsOptions {
    queryClient: QueryClient;
}

export async function prefetchFollowings(params: PrefetchFollowingsParams) {
    const {
        queryClient,
        username,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.follow.following(username),
        (client) => client.follow.getFollowings(username, page, size),
        queryOptions,
    );
}
