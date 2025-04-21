import {
    MangaPaginationResponse,
    MangaSearchArgs,
    PaginationArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for searching manga with pagination
 */
export function useMangaSearch(
    args: MangaSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            MangaPaginationResponse,
            Error,
            MangaPaginationResponse,
            MangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches manga search results for server-side rendering
 */
export async function prefetchMangaSearch(
    queryClient: QueryClient,
    args: MangaSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            MangaPaginationResponse,
            Error,
            MangaPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
