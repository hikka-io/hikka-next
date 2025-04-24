import { ArticlesTopResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting article stats (top authors and tags)
 */
export function useArticleStats({
    ...rest
}: QueryParams<ArticlesTopResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
        ...rest,
    });
}

/**
 * Function for prefetching article stats
 */
export async function prefetchArticleStats({
    ...rest
}: PrefetchQueryParams<ArticlesTopResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
        ...rest,
    });
}
