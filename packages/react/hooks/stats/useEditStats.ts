import { EditsTopPaginationResponse, PaginationArgs } from '@hikka/client';
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
 * Hook for retrieving top editors
 */
export function useEditsTop(
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            EditsTopPaginationResponse,
            Error,
            InfiniteData<EditsTopPaginationResponse>,
            EditsTopPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.stats.editsTop(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.stats.getEditsTop({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches top editors for server-side rendering
 */
export async function prefetchEditsTop(
    queryClient: QueryClient,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            EditsTopPaginationResponse,
            Error,
            EditsTopPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.stats.editsTop(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.stats.getEditsTop({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
