import { ArticlesTopResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting article stats (top authors and tags)
 */
export function useArticleStats(
    options?: Omit<
        UseQueryOptions<ArticlesTopResponse, Error, ArticlesTopResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
        options: options || {},
    });
}

/**
 * Function for prefetching article stats
 */
export async function prefetchArticleStats(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<ArticlesTopResponse, Error, ArticlesTopResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
        options: options || {},
    });
}
