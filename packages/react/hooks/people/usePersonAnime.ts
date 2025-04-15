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
    page?: number;
    size?: number;
}

/**
 * Hook for getting a person's anime work
 */
export function usePersonAnime(
    slug: string,
    options: UsePersonAnimeOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.people.anime(slug),
        (client) => client.people.getAnime(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchPersonAnime(
    queryClient: QueryClient,
    slug: string,
    options: UsePersonAnimeOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.anime(slug),
        (client) => client.people.getAnime(slug, page, size),
        queryOptions,
    );
}
