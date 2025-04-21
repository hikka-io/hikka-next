import { NovelInfoResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving novel details by slug
 */
export function useNovelInfo(
    slug: string,
    options?: Omit<
        UseQueryOptions<NovelInfoResponse, Error, NovelInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getBySlug(slug),
        options: options || {},
    });
}

/**
 * Prefetches novel details for server-side rendering
 */
export async function prefetchNovelInfo(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<NovelInfoResponse, Error, NovelInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getBySlug(slug),
        options,
    });
}
