import { HistoryPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseUserHistoryParams {
    username: string;
}

/**
 * Hook for retrieving a specific user's history
 */
export function useUserHistory({
    username,
    paginationArgs,
    ...rest
}: UseUserHistoryParams & InfiniteQueryParams<HistoryPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a specific user's history for server-side rendering
 */
export async function prefetchUserHistory({
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<HistoryPaginationResponse> &
    UseUserHistoryParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.history.getUserHistory(username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
