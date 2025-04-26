'use client';

import { AnimeScheduleResponsePaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { queryKeys } from '@/core';
import { UseAnimeScheduleParams } from '@/types/schedule';

/**
 * Hook for retrieving anime schedule
 */
export function useSearchAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: UseAnimeScheduleParams &
    InfiniteQueryParams<AnimeScheduleResponsePaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.searchAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
