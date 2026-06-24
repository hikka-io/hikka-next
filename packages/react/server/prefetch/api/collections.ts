import type {
    UseCollectionParams,
    UseCollectionsListParams,
} from '@/types/collections';
import {
    collectionByReferenceOptions,
    searchCollectionsOptions,
} from '@/options/api/collections';
import {
    type PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import {
    type PrefetchQueryParams,
    prefetchQuery,
} from '@/server/prefetchQuery';

/**
 * Prefetches a collection by reference for server-side rendering
 */
export async function prefetchCollectionByReference({
    reference,
    ...rest
}: PrefetchQueryParams & UseCollectionParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            collectionByReferenceOptions(client, { reference }),
        ...rest,
    });
}

/**
 * Prefetches collections list for server-side rendering
 */
export async function prefetchSearchCollections({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseCollectionsListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchCollectionsOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
