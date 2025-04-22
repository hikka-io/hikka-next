import {
    CommentListResponse,
    CommentsContentTypeEnum,
    PaginationArgs,
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
 * Hook for retrieving comments for a specific content
 */
export function useContentComments(
    contentType: CommentsContentTypeEnum,
    slug: string,
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
        queryKey: queryKeys.comments.content(contentType, slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getContentComments(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches comments for a specific content for server-side rendering
 */
export async function prefetchContentComments(
    queryClient: QueryClient,
    contentType: CommentsContentTypeEnum,
    slug: string,
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
        queryKey: queryKeys.comments.content(contentType, slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getContentComments(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}
