import { ArticlesTopResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseArticleStatsOptions
    extends Omit<
        UseQueryOptions<
            ArticlesTopResponse,
            Error,
            ArticlesTopResponse,
            ReturnType<typeof queryKeys.articles.stats>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting article stats (top authors and tags)
 */
export function useArticleStats(options: UseArticleStatsOptions = {}) {
    return useQuery(
        queryKeys.articles.stats(),
        (client) => client.articles.getArticleStats(),
        options,
    );
}

export async function prefetchArticleStats(
    queryClient: QueryClient,
    options: UseArticleStatsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.articles.stats(),
        (client) => client.articles.getArticleStats(),
        options,
    );
}
