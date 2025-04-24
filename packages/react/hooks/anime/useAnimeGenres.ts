import { GenreListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving all anime genres
 */
export function useAnimeGenres({
    ...rest
}: QueryParams<GenreListResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.anime.genres(),
        queryFn: (client) => client.anime.getGenres(),
        ...rest,
    });
}

/**
 * Prefetches anime genres for server-side rendering
 */
export async function prefetchAnimeGenres({
    ...rest
}: PrefetchQueryParams<GenreListResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.anime.genres(),
        queryFn: (client) => client.anime.getGenres(),
        ...rest,
    });
}
