import { AnimeEpisodesListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeEpisodesParams {
    slug: string;
}

/**
 * Hook for retrieving anime episodes with pagination
 */
export function useAnimeEpisodes({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeEpisodesParams & InfiniteQueryParams<AnimeEpisodesListResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getEpisodes(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime episodes for server-side rendering
 */
export async function prefetchAnimeEpisodes({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimeEpisodesListResponse> &
    UseAnimeEpisodesParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getEpisodes(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
