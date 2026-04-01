import {
    readBySlugOptions,
    readStatsOptions,
    readingUsersOptions,
    searchUserReadsOptions,
} from '@/options/api/read';
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
}: PrefetchQueryParams & UseReadEntryParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            readBySlugOptions(client, { contentType, slug }),
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
}: PrefetchQueryParams & UseReadStatsParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            readStatsOptions(client, { contentType, username }),
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
}: PrefetchInfiniteQueryParams & UseReadingUsersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            readingUsersOptions(client, { contentType, slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseReadListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchUserReadsOptions(client, {
                contentType,
                username,
                args,
                paginationArgs,
            }),
        ...rest,
    });
}
