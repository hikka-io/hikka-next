import { AnimeEpisodesListResponse, PaginationArgs } from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving anime episodes with pagination
 */
export function useAnimeEpisodes(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            AnimeEpisodesListResponse,
            Error,
            AnimeEpisodesListResponse,
            AnimeEpisodesListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getEpisodes(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches anime episodes for server-side rendering
 */
export async function prefetchAnimeEpisodes(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            AnimeEpisodesListResponse,
            Error,
            AnimeEpisodesListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getEpisodes(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
