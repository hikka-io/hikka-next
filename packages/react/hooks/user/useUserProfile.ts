import { UserResponseFollowed } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseUserProfileOptions
    extends Omit<
        UseQueryOptions<
            UserResponseFollowed,
            Error,
            UserResponseFollowed,
            ReturnType<typeof queryKeys.user.profile>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting user profile by username
 */
export function useUserProfile(
    username: string,
    options: UseUserProfileOptions = {},
) {
    return useQuery(
        queryKeys.user.profile(username),
        (client) => client.user.getByUsername(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export async function prefetchUserProfile(
    queryClient: QueryClient,
    username: string,
    options: UseUserProfileOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.user.profile(username),
        (client) => client.user.getByUsername(username),
        options,
    );
}
