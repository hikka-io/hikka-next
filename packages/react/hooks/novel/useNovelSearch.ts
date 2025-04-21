import {
    NovelPaginationResponse,
    NovelSearchArgs,
    PaginationArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for searching novels
 */
export function useNovelSearch(
    args: NovelSearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            NovelPaginationResponse,
            Error,
            NovelPaginationResponse,
            NovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.novel.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches novel search results for server-side rendering
 */
export async function prefetchNovelSearch(
    queryClient: QueryClient,
    args: NovelSearchArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            NovelPaginationResponse,
            Error,
            NovelPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.novel.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
