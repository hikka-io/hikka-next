import { MangaPaginationResponse, MangaSearchArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseMangaSearchParams {
    args: MangaSearchArgs;
}

/**
 * Hook for searching manga with pagination
 */
export function useSearchMangas({
    args,
    paginationArgs,
    ...rest
}: UseMangaSearchParams & InfiniteQueryParams<MangaPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.searchMangas(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches manga search results for server-side rendering
 */
export async function prefetchSearchMangas({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<MangaPaginationResponse> &
    UseMangaSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.searchMangas(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
