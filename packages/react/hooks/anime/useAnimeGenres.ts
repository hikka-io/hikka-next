import { GenreListResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving all anime genres
 */
export function useAnimeGenres(
    options?: Omit<
        UseQueryOptions<GenreListResponse, Error, GenreListResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.anime.genres(),
        queryFn: (client) => client.anime.getGenres(),
        options: options || {},
    });
}

/**
 * Prefetches anime genres for server-side rendering
 */
export async function prefetchAnimeGenres(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<GenreListResponse, Error, GenreListResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.anime.genres(),
        queryFn: (client) => client.anime.getGenres(),
        options,
    });
}
