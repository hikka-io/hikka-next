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
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime staff by anime slug
 */
export function useAnimeStaff(
    slug: string,
    options: UseAnimeStaffOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.staff(slug),
        (client) => client.anime.getStaff(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchAnimeStaff(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeStaffOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.staff(slug),
        (client) => client.anime.getStaff(slug, page, size),
        queryOptions,
    );
}
