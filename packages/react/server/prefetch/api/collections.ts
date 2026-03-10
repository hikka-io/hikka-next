import {
    collectionByReferenceOptions,
    searchCollectionsOptions,
} from '@/options/api/collections';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseCollectionParams,
    UseCollectionsListParams,
} from '@/types/collections';

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
