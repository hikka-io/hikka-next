import { AnimeInfoResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseAnimeInfoParams {
    slug: string;
}

/**
 * Hook for retrieving anime details by slug
 */
export function useAnimeInfo<TResult = AnimeInfoResponse>({
    slug,
    ...rest
}: UseAnimeInfoParams & QueryParams<AnimeInfoResponse, TResult>) {
    return useQuery<AnimeInfoResponse, Error, TResult>({
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getAnimeBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches anime details for server-side rendering
 */
export async function prefetchAnimeInfo({
    slug,
    ...rest
}: PrefetchQueryParams<AnimeInfoResponse> & UseAnimeInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.anime.details(slug),
        queryFn: (client) => client.anime.getAnimeBySlug(slug),
        ...rest,
    });
}
