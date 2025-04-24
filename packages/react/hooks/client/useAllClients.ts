import { ClientPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

/**
 * Hook for getting all clients for current user with pagination
 */
export function useAllClients({
    paginationArgs = { page: 1, size: 15 },
    ...rest
}: InfiniteQueryParams<ClientPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.client.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.client.getAll({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches all clients for server-side rendering
 */
export async function prefetchAllClients({
    paginationArgs = { page: 1, size: 15 },
    ...rest
}: PrefetchInfiniteQueryParams<ClientPaginationResponse>) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.client.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.client.getAll({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
