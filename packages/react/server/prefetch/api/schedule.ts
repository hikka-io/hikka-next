import { AnimeScheduleResponsePaginationResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { UseAnimeScheduleParams } from '@/types/schedule';

/**
 * Prefetches anime schedule for server-side rendering
 */
export async function prefetchSearchAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimeScheduleResponsePaginationResponse> &
    UseAnimeScheduleParams = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.schedule.searchAnimeSchedule(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
