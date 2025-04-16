import { AnimeInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeDetailsOptions
    extends Omit<
        UseQueryOptions<
            AnimeInfoResponse,
            Error,
            AnimeInfoResponse,
            ReturnType<typeof queryKeys.anime.details>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
}

/**
 * Hook for getting anime details by slug
 */
export function useAnimeDetails(params: UseAnimeDetailsOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.anime.details(slug),
        (client) => client.anime.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchAnimeDetailsParams extends UseAnimeDetailsOptions {
    queryClient: QueryClient;
}

export function prefetchAnimeDetails(params: PrefetchAnimeDetailsParams) {
    const { queryClient, slug, ...options } = params;

    return prefetchQuery(
        queryClient,
        queryKeys.anime.details(slug),
        (client) => client.anime.getBySlug(slug),
        options,
    );
}
