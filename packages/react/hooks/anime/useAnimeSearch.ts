import { AnimePaginationResponse, AnimeSearchArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeSearchOptions
    extends Omit<
        UseQueryOptions<
            AnimePaginationResponse,
            Error,
            AnimePaginationResponse,
            ReturnType<typeof queryKeys.anime.search>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for searching anime with filters
 */
export function useAnimeSearch(
    args: AnimeSearchArgs,
    options: UseAnimeSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.search({ ...args, page, size }),
        (client) => client.anime.search(args, page, size),
        queryOptions,
    );
}

export async function prefetchAnimeSearch(
    queryClient: QueryClient,
    args: AnimeSearchArgs,
    options: UseAnimeSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.search({ ...args, page, size }),
        (client) => client.anime.search(args, page, size),
        queryOptions,
    );
}
