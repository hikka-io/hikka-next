import { ReadContentType, UserReadPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseFollowingReadersParams {
    contentType: ReadContentType;
    slug: string;
}

/**
 * Hook for retrieving users from following list that are reading a manga/novel
 */
export function useReadingUsers({
    contentType,
    slug,
    paginationArgs,
    options,
    ...rest
}: UseFollowingReadersParams &
    InfiniteQueryParams<UserReadPaginationResponse>) {
    return useInfiniteQuery({
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
        options: {
            authProtected: true,
            ...options,
        },
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
    UseFollowingReadersParams) {
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
