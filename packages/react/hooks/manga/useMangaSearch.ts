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
    args: MangaSearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching manga with filters
 */
export function useMangaSearch(params: UseMangaSearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.manga.search({ ...args, page, size }),
        (client) => client.manga.search(args, page, size),
        queryOptions,
    );
}

export interface PrefetchMangaSearchParams extends UseMangaSearchOptions {
    queryClient: QueryClient;
}

export async function prefetchMangaSearch(params: PrefetchMangaSearchParams) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.manga.search({ ...args, page, size }),
        (client) => client.manga.search(args, page, size),
        queryOptions,
    );
}
