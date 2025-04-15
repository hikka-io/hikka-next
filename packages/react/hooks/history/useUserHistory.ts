import { HistoryPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseUserHistoryOptions
    extends Omit<
        UseQueryOptions<
            HistoryPaginationResponse,
            Error,
            HistoryPaginationResponse,
            ReturnType<typeof queryKeys.history.user>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting the history of a specific user
 */
export function useUserHistory(
    username: string,
    options: UseUserHistoryOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.history.user(username),
        (client) => client.history.getUserHistory(username, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export async function prefetchUserHistory(
    queryClient: QueryClient,
    username: string,
    options: UseUserHistoryOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.history.user(username),
        (client) => client.history.getUserHistory(username, page, size),
        queryOptions,
    );
}
