import { UserWithEmailResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving the current user's profile
 */
export function useUserMe(
    options?: Omit<
        UseQueryOptions<UserWithEmailResponse, Error, UserWithEmailResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getMe(),
        options: options || {},
    });
}

/**
 * Prefetches the current user's profile for server-side rendering
 */
export async function prefetchUserMe(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<UserWithEmailResponse, Error, UserWithEmailResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getMe(),
        options,
    });
}
