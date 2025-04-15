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
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime episodes by anime slug
 */
export function useAnimeEpisodes(
    slug: string,
    options: UseAnimeEpisodesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.episodes(slug),
        (client) => client.anime.getEpisodes(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchAnimeEpisodes(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeEpisodesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.episodes(slug),
        (client) => client.anime.getEpisodes(slug, page, size),
        queryOptions,
    );
}
