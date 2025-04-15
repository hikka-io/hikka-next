import { UserWithEmailResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCurrentUserOptions
    extends Omit<
        UseQueryOptions<
            UserWithEmailResponse,
            Error,
            UserWithEmailResponse,
            ReturnType<typeof queryKeys.user.me>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting the current user's profile
 */
export function useCurrentUser(options: UseCurrentUserOptions = {}) {
    return useQuery(
        queryKeys.user.me(),
        (client) => client.user.getMe(),
        options,
    );
}

export async function prefetchCurrentUser(
    queryClient: QueryClient,
    options: UseCurrentUserOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.user.me(),
        (client) => client.user.getMe(),
        options,
    );
}
