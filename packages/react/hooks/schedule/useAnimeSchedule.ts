import {
    AnimeScheduleArgs,
    AnimeScheduleResponsePaginationResponse,
} from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeScheduleOptions
    extends Omit<
        UseQueryOptions<
            AnimeScheduleResponsePaginationResponse,
            Error,
            AnimeScheduleResponsePaginationResponse,
            ReturnType<typeof queryKeys.schedule.anime>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime schedule
 */
export function useAnimeSchedule(
    args: AnimeScheduleArgs,
    options: UseAnimeScheduleOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.schedule.anime(args),
        (client) => client.schedule.getAnimeSchedule(args, page, size),
        queryOptions,
    );
}

export async function prefetchAnimeSchedule(
    queryClient: QueryClient,
    args: AnimeScheduleArgs,
    options: UseAnimeScheduleOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.schedule.anime(args),
        (client) => client.schedule.getAnimeSchedule(args, page, size),
        queryOptions,
    );
}
