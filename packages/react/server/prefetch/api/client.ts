import {
    clientByReferenceOptions,
    clientFullDetailsOptions,
    clientListOptions,
} from '@/options/api/client';
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
}: PrefetchQueryParams & UseClientByReferenceParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            clientByReferenceOptions(client, { reference }),
        ...rest,
    });
}

/**
 * Prefetches full client info for server-side rendering
 */
export async function prefetchClientFullDetails({
    reference,
    ...rest
}: PrefetchQueryParams & UseFullClientInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            clientFullDetailsOptions(client, { reference }),
        ...rest,
    });
}

/**
 * Prefetches all clients for server-side rendering
 */
export async function prefetchClientList({
    paginationArgs = { page: 1, size: 15 },
    ...rest
}: PrefetchInfiniteQueryParams & UseClientListParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            clientListOptions(client, { paginationArgs }),
        ...rest,
    });
}
