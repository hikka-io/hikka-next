import { MangaPaginationResponse, MangaSearchArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseMangaSearchOptions
    extends Omit<
        UseQueryOptions<
            MangaPaginationResponse,
            Error,
            MangaPaginationResponse,
            ReturnType<typeof queryKeys.manga.search>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for searching manga with filters
 */
export function useMangaSearch(
    args: MangaSearchArgs,
    options: UseMangaSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.manga.search({ ...args, page, size }),
        (client) => client.manga.search(args, page, size),
        queryOptions,
    );
}

export async function prefetchMangaSearch(
    queryClient: QueryClient,
    args: MangaSearchArgs,
    options: UseMangaSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.manga.search({ ...args, page, size }),
        (client) => client.manga.search(args, page, size),
        queryOptions,
    );
}
