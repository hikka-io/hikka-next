import { FollowListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFollowersOptions
    extends Omit<
        UseQueryOptions<
            FollowListResponse,
            Error,
            FollowListResponse,
            ReturnType<typeof queryKeys.follow.followers>
        >,
        'queryKey' | 'queryFn'
    > {
    username: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's followers
 */
export function useFollowers(params: UseFollowersOptions) {
    const { username, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.follow.followers(username),
        (client) => client.follow.getFollowers(username, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export interface PrefetchFollowersParams extends UseFollowersOptions {
    queryClient: QueryClient;
}

export async function prefetchFollowers(params: PrefetchFollowersParams) {
    const {
        queryClient,
        username,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.follow.followers(username),
        (client) => client.follow.getFollowers(username, page, size),
        queryOptions,
    );
}
