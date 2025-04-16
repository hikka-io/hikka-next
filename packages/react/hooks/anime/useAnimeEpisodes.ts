import { AnimeEpisodesListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeEpisodesOptions
    extends Omit<
        UseQueryOptions<
            AnimeEpisodesListResponse,
            Error,
            AnimeEpisodesListResponse,
            ReturnType<typeof queryKeys.anime.episodes>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime episodes by anime slug
 */
export function useAnimeEpisodes(params: UseAnimeEpisodesOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.anime.episodes(slug),
        (client) => client.anime.getEpisodes(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchAnimeEpisodesParams extends UseAnimeEpisodesOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeEpisodes(
    params: PrefetchAnimeEpisodesParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.episodes(slug),
        (client) => client.anime.getEpisodes(slug, page, size),
        queryOptions,
    );
}
