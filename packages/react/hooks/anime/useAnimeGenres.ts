import { GenreListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeGenresOptions
    extends Omit<
        UseQueryOptions<
            GenreListResponse,
            Error,
            GenreListResponse,
            ReturnType<typeof queryKeys.anime.genres>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting all anime genres
 */
export function useAnimeGenres(options: UseAnimeGenresOptions = {}) {
    return useQuery(
        queryKeys.anime.genres(),
        (client) => client.anime.getGenres(),
        options,
    );
}

export async function prefetchAnimeGenres(
    queryClient: QueryClient,
    options: UseAnimeGenresOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.anime.genres(),
        (client) => client.anime.getGenres(),
        options,
    );
}
