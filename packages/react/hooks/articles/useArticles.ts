import { ArticlesListArgs, ArticlesListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    args: ArticlesListArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a list of articles
 */
export function useArticles(params: UseArticlesOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.articles.list(args),
        (client) => client.articles.getArticles(args, page, size),
        queryOptions,
    );
}

export interface PrefetchArticlesParams extends UseArticlesOptions {
    queryClient: QueryClient;
}

export async function prefetchArticles(params: PrefetchArticlesParams) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.articles.list(args),
        (client) => client.articles.getArticles(args, page, size),
        queryOptions,
    );
}
