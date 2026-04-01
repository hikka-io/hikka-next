import { searchAnimeScheduleOptions } from '@/options/api/schedule';
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
}: PrefetchInfiniteQueryParams & UseAnimeScheduleParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchAnimeScheduleOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
