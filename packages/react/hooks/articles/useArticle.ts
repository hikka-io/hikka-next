import { ArticleResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseArticleParams {
    slug: string;
}

/**
 * Hook for getting article details
 */
export function useArticle<TResult = ArticleResponse>({
    slug,
    ...rest
}: UseArticleParams & QueryParams<ArticleResponse, TResult>) {
    return useQuery<ArticleResponse, Error, TResult>({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticle(slug),
        ...rest,
    });
}

/**
 * Function for prefetching article details
 */
export async function prefetchArticle({
    slug,
    ...rest
}: PrefetchQueryParams<ArticleResponse> & UseArticleParams) {
    return prefetchQuery({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticle(slug),
        ...rest,
    });
}
