import {
    ClientInfoResponse,
    ClientPaginationResponse,
    ClientResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseClientByReferenceParams,
    UseClientListParams,
    UseFullClientInfoParams,
} from '@/types/client';

/**
 * Prefetches client by reference for server-side rendering
 */
export async function prefetchClientByReference({
    reference,
    ...rest
}: PrefetchQueryParams<ClientResponse> & UseClientByReferenceParams) {
    return prefetchQuery({
        queryKey: queryKeys.client.byReference(reference),
        queryFn: (client) => client.client.getClientByReference(reference),
        ...rest,
    });
}

/**
 * Prefetches full client info for server-side rendering
 */
export async function prefetchClientFullDetails({
    reference,
    ...rest
}: PrefetchQueryParams<ClientInfoResponse> & UseFullClientInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.client.fullInfo(reference),
        queryFn: (client) => client.client.getClientFullDetails(reference),
        ...rest,
    });
}

/**
 * Prefetches all clients for server-side rendering
 */
export async function prefetchClientList({
    paginationArgs = { page: 1, size: 15 },
    ...rest
}: PrefetchInfiniteQueryParams<ClientPaginationResponse> &
    UseClientListParams = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.client.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.client.getClientList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
