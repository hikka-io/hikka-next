'use client';

import { AnimeScheduleResponsePaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { searchAnimeScheduleOptions } from '@/options/api/schedule';
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
