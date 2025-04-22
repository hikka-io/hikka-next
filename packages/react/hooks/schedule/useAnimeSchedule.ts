import {
    AnimeScheduleArgs,
    AnimeScheduleResponsePaginationResponse,
    PaginationArgs,
} from '@hikka/client';
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
 * Hook for retrieving anime schedule
 */
export function useAnimeSchedule(
    args: AnimeScheduleArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            AnimeScheduleResponsePaginationResponse,
            Error,
            InfiniteData<AnimeScheduleResponsePaginationResponse>,
            AnimeScheduleResponsePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.getAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches anime schedule for server-side rendering
 */
export async function prefetchAnimeSchedule(
    queryClient: QueryClient,
    args: AnimeScheduleArgs = {},
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            AnimeScheduleResponsePaginationResponse,
            Error,
            AnimeScheduleResponsePaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.getAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
