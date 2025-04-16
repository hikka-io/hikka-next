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
    username: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting the history of a specific user
 */
export function useUserHistory(params: UseUserHistoryOptions) {
    const { username, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.history.user(username),
        (client) => client.history.getUserHistory(username, page, size),
        {
            enabled: !!username,
            ...queryOptions,
        },
    );
}

export interface PrefetchUserHistoryParams extends UseUserHistoryOptions {
    queryClient: QueryClient;
}

export async function prefetchUserHistory(params: PrefetchUserHistoryParams) {
    const {
        queryClient,
        username,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.history.user(username),
        (client) => client.history.getUserHistory(username, page, size),
        queryOptions,
    );
}
