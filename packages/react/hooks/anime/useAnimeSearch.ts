import {
    AnimePaginationResponse,
    AnimeSearchArgs,
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
 * Hook for searching anime with pagination
 */
export function useAnimeSearch(
    args: AnimeSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            AnimePaginationResponse,
            Error,
            InfiniteData<AnimePaginationResponse>,
            AnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches anime search results for server-side rendering
 */
export async function prefetchAnimeSearch(
    queryClient: QueryClient,
    args: AnimeSearchArgs,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            AnimePaginationResponse,
            Error,
            AnimePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
