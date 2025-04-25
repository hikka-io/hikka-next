import {
    CollectionContent,
    CollectionsListArgs,
    CollectionsListResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseCollectionsListParams {
    args: CollectionsListArgs;
}

/**
 * Hook for retrieving collections list
 */
export function useCollectionsList({
    args,
    paginationArgs,
    ...rest
}: UseCollectionsListParams &
    InfiniteQueryParams<CollectionsListResponse<CollectionContent>>) {
    return useInfiniteQuery({
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.collections.searchCollections(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches collections list for server-side rendering
 */
export async function prefetchCollectionsList({
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
