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
    args: AnimeSearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching anime with filters
 */
export function useAnimeSearch(params: UseAnimeSearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.anime.search({ ...args, page, size }),
        (client) => client.anime.search(args, page, size),
        queryOptions,
    );
}

export interface PrefetchAnimeSearchParams extends UseAnimeSearchOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeSearch(params: PrefetchAnimeSearchParams) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.search({ ...args, page, size }),
        (client) => client.anime.search(args, page, size),
        queryOptions,
    );
}
