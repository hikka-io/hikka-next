import {
    CollectionContent,
    CollectionResponse,
    CollectionsListResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
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
}: PrefetchQueryParams<CollectionResponse<CollectionContent>> &
    UseCollectionParams) {
    return prefetchQuery({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) =>
            client.collections.getCollectionByReference(reference),
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
}: PrefetchInfiniteQueryParams<CollectionsListResponse<CollectionContent>> &
    UseCollectionsListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.collections.searchCollections(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
