import { FollowResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFollowStatusOptions
    extends Omit<
        UseQueryOptions<
            FollowResponse,
            Error,
            FollowResponse,
            ReturnType<typeof queryKeys.follow.check>
        >,
        'queryKey' | 'queryFn'
    > {
    username: string;
}

/**
 * Hook for checking if the current user is following another user
 */
export function useFollowStatus(params: UseFollowStatusOptions) {
    const { username, ...options } = params;

    return useQuery(
        queryKeys.follow.check(username),
        (client) => client.follow.checkFollow(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export interface PrefetchFollowStatusParams extends UseFollowStatusOptions {
    queryClient: QueryClient;
}

export async function prefetchFollowStatus(params: PrefetchFollowStatusParams) {
    const { queryClient, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.follow.check(username),
        (client) => client.follow.checkFollow(username),
        options,
    );
}
