import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseFollowStatsParams,
    UseFollowStatusParams,
    UseFollowersParams,
    UseFollowingsParams,
} from '@/types/follow';

export function followStatusOptions(
    client: HikkaClient,
    { username }: UseFollowStatusParams,
) {
    return queryOptions({
        queryKey: queryKeys.follow.status(username),
        queryFn: () => client.follow.getFollowStatus(username),
    });
}

export function userFollowStatsOptions(
    client: HikkaClient,
    { username }: UseFollowStatsParams,
) {
    return queryOptions({
        queryKey: queryKeys.follow.stats(username),
        queryFn: () => client.follow.getUserFollowStats(username),
    });
}

export function userFollowersOptions(
    client: HikkaClient,
    {
        username,
        paginationArgs,
    }: UseFollowersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.follow.followers(username, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.follow.getUserFollowers(username, {
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

export function userFollowingsOptions(
    client: HikkaClient,
    {
        username,
        paginationArgs,
    }: UseFollowingsParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.follow.followings(username, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.follow.getUserFollowings(username, {
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
