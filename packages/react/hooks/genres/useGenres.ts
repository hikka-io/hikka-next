import { GenreListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseGenresOptions
    extends Omit<
        UseQueryOptions<
            GenreListResponse,
            Error,
            GenreListResponse,
            ReturnType<typeof queryKeys.genres.list>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting all genres
 */
export function useGenres(options: UseGenresOptions = {}) {
    return useQuery(
        queryKeys.genres.list(),
        (client) => client.genres.getGenres(),
        options,
    );
}

export async function prefetchGenres(
    queryClient: QueryClient,
    options: UseGenresOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.genres.list(),
        (client) => client.genres.getGenres(),
        options,
    );
}
