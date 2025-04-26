import { CommentListResponse, CommentResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseCommentListParams,
    UseCommentThreadParams,
    UseContentCommentsParams,
    UseLatestCommentsParams,
} from '@/types/comments';

/**
 * Prefetches a user's comments list for server-side rendering
 */
export async function prefetchCommentList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CommentListResponse> &
    UseCommentListParams = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.comments.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getCommentList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a comment thread for server-side rendering
 */
export async function prefetchCommentThread({
    commentReference,
    ...rest
}: PrefetchQueryParams<CommentResponse> & UseCommentThreadParams) {
    return prefetchQuery({
        queryKey: queryKeys.comments.thread(commentReference),
        queryFn: (client) => client.comments.getCommentThread(commentReference),
        ...rest,
    });
}

/**
 * Prefetches comments for a specific content for server-side rendering
 */
export async function prefetchContentComments({
    contentType,
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CommentListResponse> &
    UseContentCommentsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.comments.content(contentType, slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.comments.getContentComments(contentType, slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches latest comments for server-side rendering
 */
export async function prefetchLatestComments({
    ...rest
}: PrefetchQueryParams<CommentResponse[]> & UseLatestCommentsParams = {}) {
    return prefetchQuery({
        queryKey: queryKeys.comments.latest(),
        queryFn: (client) => client.comments.getLatestComments(),
        ...rest,
    });
}
