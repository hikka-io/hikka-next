import { NovelPaginationResponse, NovelSearchArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseNovelSearchParams {
    args?: NovelSearchArgs;
}

/**
 * Hook for searching novels
 */
export function useSearchNovels({
    args = {},
    paginationArgs,
    ...rest
}: UseNovelSearchParams & InfiniteQueryParams<NovelPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.novel.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.searchNovels(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches novel search results for server-side rendering
 */
export async function prefetchSearchNovels({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<NovelPaginationResponse> &
    UseNovelSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.novel.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.searchNovels(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
