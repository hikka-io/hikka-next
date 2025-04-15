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
export function useFollowingHistory(options: UseFollowingHistoryOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.history.following(),
        (client) => client.history.getFollowingHistory(page, size),
        queryOptions,
    );
}

export async function prefetchFollowingHistory(
    queryClient: QueryClient,
    options: UseFollowingHistoryOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.history.following(),
        (client) => client.history.getFollowingHistory(page, size),
        queryOptions,
    );
}
