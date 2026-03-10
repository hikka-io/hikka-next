import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseFollowingWatchersParams,
    UseWatchEntryParams,
    UseWatchListParams,
    UseWatchStatsParams,
} from '@/types/watch';

export function watchBySlugOptions(
    client: HikkaClient,
    { slug }: UseWatchEntryParams,
) {
    return queryOptions({
        queryKey: queryKeys.watch.entry(slug),
        queryFn: () => client.watch.getWatchBySlug(slug),
    });
}

export function userWatchStatsOptions(
    client: HikkaClient,
    { username }: UseWatchStatsParams,
) {
    return queryOptions({
        queryKey: queryKeys.watch.stats(username),
        queryFn: () => client.watch.getUserWatchStats(username),
    });
}

export function searchUserWatchesOptions(
    client: HikkaClient,
    {
        username,
        args,
        paginationArgs,
    }: UseWatchListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.watch.list(username, args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.watch.searchUserWatches(username, args, {
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

export function watchingUsersOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseFollowingWatchersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.watch.followingUsers(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.watch.getWatchingUsers(slug, {
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
