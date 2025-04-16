import { HistoryPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFollowingHistoryOptions
    extends Omit<
        UseQueryOptions<
            HistoryPaginationResponse,
            Error,
            HistoryPaginationResponse,
            ReturnType<typeof queryKeys.history.following>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting the history of users that the current user follows
 */
export function useFollowingHistory(params: UseFollowingHistoryOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.history.following(),
        (client) => client.history.getFollowingHistory(page, size),
        queryOptions,
    );
}

export interface PrefetchFollowingHistoryParams
    extends UseFollowingHistoryOptions {
    queryClient: QueryClient;
}

export async function prefetchFollowingHistory(
    params: PrefetchFollowingHistoryParams,
) {
    const { queryClient, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.history.following(),
        (client) => client.history.getFollowingHistory(page, size),
        queryOptions,
    );
}
