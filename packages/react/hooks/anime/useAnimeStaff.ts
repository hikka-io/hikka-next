import { AnimeStaffPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeStaffParams {
    slug: string;
}

/**
 * Hook for retrieving anime staff with pagination
 */
export function useAnimeStaff({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeStaffParams & InfiniteQueryParams<AnimeStaffPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getStaff(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime staff for server-side rendering
 */
export async function prefetchAnimeStaff({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimeStaffPaginationResponse> &
    UseAnimeStaffParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getStaff(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
