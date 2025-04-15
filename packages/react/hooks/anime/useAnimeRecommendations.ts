import { AnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime recommendations by anime slug
 */
export function useAnimeRecommendations(
    slug: string,
    options: UseAnimeRecommendationsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.recommendations(slug),
        (client) => client.anime.getRecommendations(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchAnimeRecommendations(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeRecommendationsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.recommendations(slug),
        (client) => client.anime.getRecommendations(slug, page, size),
        queryOptions,
    );
}
