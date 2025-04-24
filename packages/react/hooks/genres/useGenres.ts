import { GenreListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving all genres
 */
export function useGenres<TResult = GenreListResponse>({
    ...rest
}: QueryParams<GenreListResponse, TResult> = {}) {
    return useQuery<GenreListResponse, Error, TResult>({
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        ...rest,
    });
}

/**
 * Prefetches all genres for server-side rendering
 */
export async function prefetchGenres({
    ...rest
}: PrefetchQueryParams<GenreListResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        ...rest,
    });
}
