import { CommentListResponse, PaginationArgs } from '@hikka/client';
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
 * Hook for retrieving a user's comments list
 */
export function useCommentsList(
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            CommentListResponse,
            Error,
            InfiniteData<CommentListResponse>,
            CommentListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.comments.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getList({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches a user's comments list for server-side rendering
 */
export async function prefetchCommentsList(
    queryClient: QueryClient,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            CommentListResponse,
            Error,
            CommentListResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.comments.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getList({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
