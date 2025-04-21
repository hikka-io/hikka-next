import { UserResponseFollowed } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a user profile by username
 */
export function useUserByUsername(
    username: string,
    options?: Omit<
        UseQueryOptions<UserResponseFollowed, Error, UserResponseFollowed>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getByUsername(username),
        options: options || {},
    });
}

/**
 * Prefetches a user profile by username for server-side rendering
 */
export async function prefetchUserByUsername(
    queryClient: QueryClient,
    username: string,
    options?: Omit<
        FetchQueryOptions<UserResponseFollowed, Error, UserResponseFollowed>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getByUsername(username),
        options,
    });
}
