import {
    ArticlesListArgs,
    ArticlesListResponse,
    PaginationArgs,
} from '@hikka/client';
import { FetchInfiniteQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for getting a list of articles
 */
export function useArticlesList(
    args: ArticlesListArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            ArticlesListResponse,
            Error,
            ArticlesListResponse,
            ArticlesListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.getArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}

/**
 * Function for prefetching articles list
 */
export async function prefetchArticlesList(
    queryClient: QueryClient,
    args: ArticlesListArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            ArticlesListResponse,
            Error,
            ArticlesListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.getArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        options: options || {},
    });
}
