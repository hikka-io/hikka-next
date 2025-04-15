import { MangaInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    > {}

/**
 * Hook for getting manga details by slug
 */
export function useMangaDetails(
    slug: string,
    options: UseMangaDetailsOptions = {},
) {
    return useQuery(
        queryKeys.manga.details(slug),
        (client) => client.manga.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchMangaDetails(
    queryClient: QueryClient,
    slug: string,
    options: UseMangaDetailsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.manga.details(slug),
        (client) => client.manga.getBySlug(slug),
        options,
    );
}
