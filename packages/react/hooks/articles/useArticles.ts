import { ArticlesListArgs, ArticlesListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseArticlesOptions
    extends Omit<
        UseQueryOptions<
            ArticlesListResponse,
            Error,
            ArticlesListResponse,
            ReturnType<typeof queryKeys.articles.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting a list of articles
 */
export function useArticles(
    args: ArticlesListArgs,
    options: UseArticlesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.articles.list(args),
        (client) => client.articles.getArticles(args, page, size),
        queryOptions,
    );
}

export async function prefetchArticles(
    queryClient: QueryClient,
    args: ArticlesListArgs,
    options: UseArticlesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.articles.list(args),
        (client) => client.articles.getArticles(args, page, size),
        queryOptions,
    );
}
