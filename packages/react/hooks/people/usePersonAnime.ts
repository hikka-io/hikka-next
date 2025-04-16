import { PersonAnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonAnimeOptions
    extends Omit<
        UseQueryOptions<
            PersonAnimePaginationResponse,
            Error,
            PersonAnimePaginationResponse,
            ReturnType<typeof queryKeys.people.anime>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a person's anime work
 */
export function usePersonAnime(params: UsePersonAnimeOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.people.anime(slug),
        (client) => client.people.getAnime(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchPersonAnimeParams extends UsePersonAnimeOptions {
    queryClient: QueryClient;
}

export async function prefetchPersonAnime(params: PrefetchPersonAnimeParams) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.anime(slug),
        (client) => client.people.getAnime(slug, page, size),
        queryOptions,
    );
}
