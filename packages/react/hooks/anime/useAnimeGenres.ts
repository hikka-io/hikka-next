import { GenreListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
export function useAnimeGenres(params: UseAnimeGenresOptions = {}) {
    return useQuery(
        queryKeys.anime.genres(),
        (client) => client.anime.getGenres(),
        params,
    );
}

export interface PrefetchAnimeGenresParams extends UseAnimeGenresOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeGenres(params: PrefetchAnimeGenresParams) {
    const { queryClient, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.genres(),
        (client) => client.anime.getGenres(),
        options,
    );
}
