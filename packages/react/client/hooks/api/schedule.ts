import type { AnimeScheduleResponsePaginationResponse } from '@hikka/client';

import type { UseAnimeScheduleParams } from '@/types/schedule';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { searchAnimeScheduleOptions } from '@/options/api/schedule';

/**
 * Hook for retrieving anime schedule
 */
export function useSearchAnimeSchedule({
    args = {},
    paginationArgs,
    ...rest
}: UseAnimeScheduleParams &
    InfiniteQueryParams<AnimeScheduleResponsePaginationResponse> = {}) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchAnimeScheduleOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
