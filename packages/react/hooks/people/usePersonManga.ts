import { PersonMangaPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a person's manga work
 */
export function usePersonManga(params: UsePersonMangaOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.people.manga(slug),
        (client) => client.people.getManga(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchPersonMangaParams extends UsePersonMangaOptions {
    queryClient: QueryClient;
}

export async function prefetchPersonManga(params: PrefetchPersonMangaParams) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.manga(slug),
        (client) => client.people.getManga(slug, page, size),
        queryOptions,
    );
}
