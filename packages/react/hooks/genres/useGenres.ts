import { GenreListResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving all genres
 */
export function useGenres(
    options?: Omit<
        UseQueryOptions<GenreListResponse, Error, GenreListResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        options: options || {},
    });
}

/**
 * Prefetches all genres for server-side rendering
 */
export async function prefetchGenres(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<GenreListResponse, Error, GenreListResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        options,
    });
}
