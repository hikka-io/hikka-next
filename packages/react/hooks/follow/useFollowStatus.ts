import { FollowResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for checking if a user is followed
 */
export function useFollowStatus(
    username: string,
    options?: Omit<
        UseQueryOptions<FollowResponse, Error, FollowResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.checkFollow(username),
        options: options || {},
    });
}

/**
 * Prefetches follow status for server-side rendering
 */
export async function prefetchFollowStatus(
    queryClient: QueryClient,
    username: string,
    options?: Omit<
        FetchQueryOptions<FollowResponse, Error, FollowResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.follow.status(username),
        queryFn: (client) => client.follow.checkFollow(username),
        options,
    });
}
