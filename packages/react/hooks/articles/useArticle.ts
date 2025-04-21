import { ArticleResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting article details
 */
export function useArticle(
    slug: string,
    options?: Omit<
        UseQueryOptions<ArticleResponse, Error, ArticleResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticle(slug),
        options: options || {},
    });
}

/**
 * Function for prefetching article details
 */
export async function prefetchArticle(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<ArticleResponse, Error, ArticleResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticle(slug),
        options: options || {},
    });
}
