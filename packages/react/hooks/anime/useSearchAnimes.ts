import { AnimePaginationResponse, AnimeSearchArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeSearchParams {
    args: AnimeSearchArgs;
}

/**
 * Hook for searching anime with pagination
 */
export function useSearchAnimes({
    args,
    paginationArgs,
    ...rest
}: UseAnimeSearchParams & InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.searchAnimes(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime search results for server-side rendering
 */
export async function prefetchSearchAnimes({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.searchAnimes(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
