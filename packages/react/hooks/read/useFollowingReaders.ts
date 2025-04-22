import {
    PaginationArgs,
    ReadContentTypeEnum,
    UserReadPaginationResponse,
} from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    InfiniteData,
    QueryClient,
} from '@tanstack/query-core';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving users from following list that are reading a manga/novel
 */
export function useFollowingReaders(
    contentType: ReadContentTypeEnum,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            UserReadPaginationResponse,
            Error,
            InfiniteData<UserReadPaginationResponse>,
            UserReadPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.read.followingUsers(
            contentType,
            slug,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getFollowingUsers(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches users from following list that are reading a manga/novel for server-side rendering
 */
export async function prefetchFollowingReaders(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    slug: string,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            UserReadPaginationResponse,
            Error,
            UserReadPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.read.followingUsers(
            contentType,
            slug,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.getFollowingUsers(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
