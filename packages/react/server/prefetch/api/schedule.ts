import type { UseAnimeScheduleParams } from '@/types/schedule';
import { searchAnimeScheduleOptions } from '@/options/api/schedule';
import {
    type PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';

/**
 * Prefetches anime schedule for server-side rendering
 */
export async function prefetchSearchAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseAnimeScheduleParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchAnimeScheduleOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
