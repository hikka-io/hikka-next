import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseReadEntryParams,
    UseReadListParams,
    UseReadStatsParams,
    UseReadingUsersParams,
} from '@/types/read';

export function readBySlugOptions(
    client: HikkaClient,
    { contentType, slug }: UseReadEntryParams,
) {
    return queryOptions({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: () => client.read.getReadBySlug(contentType, slug),
    });
}

export function readStatsOptions(
    client: HikkaClient,
    { contentType, username }: UseReadStatsParams,
) {
    return queryOptions({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: () => client.read.getUserReadStats(contentType, username),
    });
}

export function searchUserReadsOptions(
    client: HikkaClient,
    {
        contentType,
        username,
        args,
        paginationArgs,
    }: UseReadListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: ({ pageParam }) =>
            client.read.searchUserReads(contentType, username, args, {
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

export function readingUsersOptions(
    client: HikkaClient,
    {
        contentType,
        slug,
        paginationArgs,
    }: UseReadingUsersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.read.followingUsers(
            contentType,
            slug,
            paginationArgs,
        ),
        queryFn: ({ pageParam }) =>
            client.read.getReadingUsers(contentType, slug, {
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
