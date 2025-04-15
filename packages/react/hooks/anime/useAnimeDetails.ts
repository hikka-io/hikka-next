import { AnimeInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    > {}

/**
 * Hook for getting anime details by slug
 */
export function useAnimeDetails(
    slug: string,
    options: UseAnimeDetailsOptions = {},
) {
    return useQuery(
        queryKeys.anime.details(slug),
        (client) => client.anime.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export function prefetchAnimeDetails(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeDetailsOptions = {},
) {
    return prefetchQuery(
        queryClient,
        queryKeys.anime.details(slug),
        (client) => client.anime.getBySlug(slug),
        options,
    );
}
