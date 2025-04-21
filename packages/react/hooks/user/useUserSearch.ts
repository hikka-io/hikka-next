import { QuerySearchRequiredArgs, UserResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for searching users
 */
export function useUserSearch(
    args: QuerySearchRequiredArgs,
    options?: Omit<
        UseQueryOptions<UserResponse[], Error, UserResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.search(args),
        options: options || {},
    });
}

/**
 * Prefetches user search results for server-side rendering
 */
export async function prefetchUserSearch(
    queryClient: QueryClient,
    args: QuerySearchRequiredArgs,
    options?: Omit<
        FetchQueryOptions<UserResponse[], Error, UserResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.search(args),
        options,
    });
}
