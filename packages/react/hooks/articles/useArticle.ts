import { ArticleResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    slug: string;
}

/**
 * Hook for getting article details
 */
export function useArticle(params: UseArticleOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.articles.details(slug),
        (client) => client.articles.getArticle(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchArticleParams extends UseArticleOptions {
    queryClient: QueryClient;
}

export async function prefetchArticle(params: PrefetchArticleParams) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.articles.details(slug),
        (client) => client.articles.getArticle(slug),
        options,
    );
}
