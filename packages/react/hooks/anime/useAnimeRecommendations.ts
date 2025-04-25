import { AnimePaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeRecommendationsParams {
    slug: string;
}

/**
 * Hook for retrieving anime recommendations with pagination
 */
export function useAnimeRecommendations({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeRecommendationsParams &
    InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.recommendations(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeRecommendations(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime recommendations for server-side rendering
 */
export async function prefetchAnimeRecommendations({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeRecommendationsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.recommendations(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeRecommendations(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
