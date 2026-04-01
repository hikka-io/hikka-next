import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseAnimeScheduleParams } from '@/types/schedule';

export function searchAnimeScheduleOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UseAnimeScheduleParams & { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.schedule.anime(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.schedule.searchAnimeSchedule(args, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
