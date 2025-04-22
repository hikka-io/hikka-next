import { AnimeStaffPaginationResponse, PaginationArgs } from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving anime staff with pagination
 */
export function useAnimeStaff(
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            AnimeStaffPaginationResponse,
            Error,
            InfiniteData<AnimeStaffPaginationResponse>,
            AnimeStaffPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getStaff(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches anime staff for server-side rendering
 */
export async function prefetchAnimeStaff(
    queryClient: QueryClient,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            AnimeStaffPaginationResponse,
            Error,
            AnimeStaffPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getStaff(slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
