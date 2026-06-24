import { infiniteQueryOptions } from '@tanstack/react-query';

import type { HikkaClient, PaginationArgs } from '@hikka/client';

import type { UseUserHistoryParams } from '@/types/history';
import { queryKeys } from '@/core';

export function followingHistoryOptions(
    client: HikkaClient,
    { paginationArgs }: { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.history.following(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.history.getFollowingHistory({
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

export function userHistoryOptions(
    client: HikkaClient,
    {
        username,
        paginationArgs,
    }: UseUserHistoryParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.history.user(username, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.history.getUserHistory(username, {
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
