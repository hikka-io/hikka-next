import {
    AnimeScheduleArgs,
    AnimeScheduleResponsePaginationResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeScheduleParams {
    args?: AnimeScheduleArgs;
}

/**
 * Hook for retrieving anime schedule
 */
export function useAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: UseAnimeScheduleParams &
    InfiniteQueryParams<AnimeScheduleResponsePaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.getAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime schedule for server-side rendering
 */
export async function prefetchAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimeScheduleResponsePaginationResponse> &
    UseAnimeScheduleParams = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.getAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
