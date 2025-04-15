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
    > {}

/**
 * Hook for checking if the current user is following another user
 */
export function useFollowStatus(
    username: string,
    options: UseFollowStatusOptions = {},
) {
    return useQuery(
        queryKeys.follow.check(username),
        (client) => client.follow.checkFollow(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export async function prefetchFollowStatus(
    queryClient: QueryClient,
    username: string,
    options: UseFollowStatusOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.follow.check(username),
        (client) => client.follow.checkFollow(username),
        options,
    );
}
