import { CommentListResponse, CommentsContentType } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseContentCommentsParams {
    contentType: CommentsContentType;
    slug: string;
}

/**
 * Hook for retrieving comments for a specific content
 */
export function useContentComments({
    contentType,
    slug,
    paginationArgs,
    ...rest
}: UseContentCommentsParams & InfiniteQueryParams<CommentListResponse>) {
    return useInfiniteQuery({
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
