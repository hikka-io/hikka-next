import { MangaInfoResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving manga details by slug
 */
export function useMangaInfo(
    slug: string,
    options?: Omit<
        UseQueryOptions<MangaInfoResponse, Error, MangaInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getBySlug(slug),
        options: options || {},
    });
}

/**
 * Prefetches manga details for server-side rendering
 */
export async function prefetchMangaInfo(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<MangaInfoResponse, Error, MangaInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getBySlug(slug),
        options,
    });
}
