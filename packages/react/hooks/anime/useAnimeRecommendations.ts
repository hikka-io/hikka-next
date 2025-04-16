import { AnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeRecommendationsOptions
    extends Omit<
        UseQueryOptions<
            AnimePaginationResponse,
            Error,
            AnimePaginationResponse,
            ReturnType<typeof queryKeys.anime.recommendations>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime recommendations by anime slug
 */
export function useAnimeRecommendations(
    params: UseAnimeRecommendationsOptions,
) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.anime.recommendations(slug),
        (client) => client.anime.getRecommendations(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchAnimeRecommendationsParams
    extends UseAnimeRecommendationsOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeRecommendations(
    params: PrefetchAnimeRecommendationsParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.recommendations(slug),
        (client) => client.anime.getRecommendations(slug, page, size),
        queryOptions,
    );
}
