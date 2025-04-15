import { FollowListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's followers
 */
export function useFollowers(
    username: string,
    options: UseFollowersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.follow.followers(username),
        (client) => client.follow.getFollowers(username, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export async function prefetchFollowers(
    queryClient: QueryClient,
    username: string,
    options: UseFollowersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.follow.followers(username),
        (client) => client.follow.getFollowers(username, page, size),
        queryOptions,
    );
}
