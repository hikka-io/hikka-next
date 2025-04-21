import { ActivityResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a user's activity
 */
export function useUserActivity(
    username: string,
    options?: Omit<
        UseQueryOptions<ActivityResponse[], Error, ActivityResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getActivity(username),
        options: options || {},
    });
}

/**
 * Prefetches a user's activity for server-side rendering
 */
export async function prefetchUserActivity(
    queryClient: QueryClient,
    username: string,
    options?: Omit<
        FetchQueryOptions<ActivityResponse[], Error, ActivityResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getActivity(username),
        options,
    });
}
