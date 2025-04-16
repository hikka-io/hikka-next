import { MangaInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseMangaDetailsOptions
    extends Omit<
        UseQueryOptions<
            MangaInfoResponse,
            Error,
            MangaInfoResponse,
            ReturnType<typeof queryKeys.manga.details>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
}

/**
 * Hook for getting manga details by slug
 */
export function useMangaDetails(params: UseMangaDetailsOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.manga.details(slug),
        (client) => client.manga.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchMangaDetailsParams extends UseMangaDetailsOptions {
    queryClient: QueryClient;
}

export async function prefetchMangaDetails(params: PrefetchMangaDetailsParams) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.manga.details(slug),
        (client) => client.manga.getBySlug(slug),
        options,
    );
}
