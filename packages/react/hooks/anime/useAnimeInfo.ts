import { AnimeInfoResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving anime details by slug
 */
export function useAnimeInfo(
    slug: string,
    options?: Omit<
        UseQueryOptions<AnimeInfoResponse, Error, AnimeInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getBySlug(slug),
        options: options || {},
    });
}

/**
 * Prefetches anime details for server-side rendering
 */
export async function prefetchAnimeInfo(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<AnimeInfoResponse, Error, AnimeInfoResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getBySlug(slug),
        options,
    });
}
