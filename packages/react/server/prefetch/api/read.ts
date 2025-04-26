import {
    ReadPaginationResponse,
    ReadResponse,
    ReadStatsResponse,
    UserReadPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseReadEntryParams,
    UseReadListParams,
    UseReadStatsParams,
    UseReadingUsersParams,
} from '@/types/read';

/**
 * Prefetches a read entry for server-side rendering
 */
export async function prefetchReadBySlug({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<ReadResponse> & UseReadEntryParams) {
    return prefetchQuery({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.getReadBySlug(contentType, slug),
        ...rest,
    });
}

/**
 * Prefetches read stats for a user for server-side rendering
 */
export async function prefetchReadStats({
    contentType,
    username,
    ...rest
}: PrefetchQueryParams<ReadStatsResponse> & UseReadStatsParams) {
    return prefetchQuery({
        queryKey: queryKeys.read.stats(contentType, username),
        queryFn: (client) =>
            client.read.getUserReadStats(contentType, username),
        ...rest,
    });
}

/**
 * Prefetches users from following list that are reading a manga/novel for server-side rendering
 */
export async function prefetchReadingUsers({
    contentType,
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<UserReadPaginationResponse> &
    UseReadingUsersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.read.followingUsers(
            contentType,
            slug,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getReadingUsers(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a user's read list for server-side rendering
 */
export async function prefetchSearchUserReads({
    contentType,
    username,
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ReadPaginationResponse> & UseReadListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.searchUserReads(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
