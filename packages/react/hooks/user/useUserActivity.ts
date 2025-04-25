import { ActivityResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseUserActivityParams {
    username: string;
}

/**
 * Hook for retrieving a user's activity
 */
export function useUserActivity({
    username,
    ...rest
}: UseUserActivityParams & QueryParams<ActivityResponse[]>) {
    return useQuery({
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getUserActivity(username),
        ...rest,
    });
}

/**
 * Prefetches a user's activity for server-side rendering
 */
export async function prefetchUserActivity({
    username,
    ...rest
}: PrefetchQueryParams<ActivityResponse[]> & UseUserActivityParams) {
    return prefetchQuery({
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getUserActivity(username),
        ...rest,
    });
}
