import { PersonMangaPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonMangaOptions
    extends Omit<
        UseQueryOptions<
            PersonMangaPaginationResponse,
            Error,
            PersonMangaPaginationResponse,
            ReturnType<typeof queryKeys.people.manga>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting a person's manga work
 */
export function usePersonManga(
    slug: string,
    options: UsePersonMangaOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.people.manga(slug),
        (client) => client.people.getManga(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchPersonManga(
    queryClient: QueryClient,
    slug: string,
    options: UsePersonMangaOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.manga(slug),
        (client) => client.people.getManga(slug, page, size),
        queryOptions,
    );
}
