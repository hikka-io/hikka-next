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
    args: AnimeScheduleArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime schedule
 */
export function useAnimeSchedule(params: UseAnimeScheduleOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.schedule.anime(args),
        (client) => client.schedule.getAnimeSchedule(args, page, size),
        queryOptions,
    );
}

export interface PrefetchAnimeScheduleParams extends UseAnimeScheduleOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeSchedule(
    params: PrefetchAnimeScheduleParams,
) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.schedule.anime(args),
        (client) => client.schedule.getAnimeSchedule(args, page, size),
        queryOptions,
    );
}
