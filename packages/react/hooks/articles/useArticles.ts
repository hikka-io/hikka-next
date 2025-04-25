import { ArticlesListArgs, ArticlesListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseArticlesListParams {
    args?: ArticlesListArgs;
}

/**
 * Hook for getting a list of articles
 */
export function useArticlesList({
    args = {},
    paginationArgs,
    ...rest
}: UseArticlesListParams & InfiniteQueryParams<ArticlesListResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.searchArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Function for prefetching articles list
 */
export async function prefetchArticlesList({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ArticlesListResponse> & UseArticlesListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.searchArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
