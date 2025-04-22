import {
    CollectionsListArgs,
    CollectionsListResponse,
    PaginationArgs,
} from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving collections list
 */
export function useCollectionsList(
    args: CollectionsListArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CollectionsListResponse,
            Error,
            InfiniteData<CollectionsListResponse>,
            CollectionsListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.collections.getCollections(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches collections list for server-side rendering
 */
export async function prefetchCollectionsList(
    queryClient: QueryClient,
    args: CollectionsListArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CollectionsListResponse,
            Error,
            CollectionsListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.collections.getCollections(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
