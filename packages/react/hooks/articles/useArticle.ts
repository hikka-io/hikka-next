import { ArticleResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseArticleOptions
    extends Omit<
        UseQueryOptions<
            ArticleResponse,
            Error,
            ArticleResponse,
            ReturnType<typeof queryKeys.articles.details>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting article details
 */
export function useArticle(slug: string, options: UseArticleOptions = {}) {
    return useQuery(
        queryKeys.articles.details(slug),
        (client) => client.articles.getArticle(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchArticle(
    queryClient: QueryClient,
    slug: string,
    options: UseArticleOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.articles.details(slug),
        (client) => client.articles.getArticle(slug),
        options,
    );
}
