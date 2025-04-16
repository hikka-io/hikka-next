import { AnimeStaffPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeStaffOptions
    extends Omit<
        UseQueryOptions<
            AnimeStaffPaginationResponse,
            Error,
            AnimeStaffPaginationResponse,
            ReturnType<typeof queryKeys.anime.staff>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime staff by anime slug
 */
export function useAnimeStaff(params: UseAnimeStaffOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.anime.staff(slug),
        (client) => client.anime.getStaff(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchAnimeStaffParams extends UseAnimeStaffOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeStaff(params: PrefetchAnimeStaffParams) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.staff(slug),
        (client) => client.anime.getStaff(slug, page, size),
        queryOptions,
    );
}
