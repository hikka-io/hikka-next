import { UserResponseFollowed } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    username: string;
}

/**
 * Hook for getting user profile by username
 */
export function useUserProfile(params: UseUserProfileOptions) {
    const { username, ...options } = params;

    return useQuery(
        queryKeys.user.profile(username),
        (client) => client.user.getByUsername(username),
        {
            enabled: !!username,
            ...options,
        },
    );
}

export interface PrefetchUserProfileParams extends UseUserProfileOptions {
    queryClient: QueryClient;
}

export async function prefetchUserProfile(params: PrefetchUserProfileParams) {
    const { queryClient, username, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.user.profile(username),
        (client) => client.user.getByUsername(username),
        options,
    );
}
