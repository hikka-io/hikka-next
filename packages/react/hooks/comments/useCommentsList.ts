import { CommentListResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving a user's comments list
 */
export function useCommentsList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<CommentListResponse> = {}) {
    return useInfiniteQuery({
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
 * Prefetches a user's comments list for server-side rendering
 */
export async function prefetchCommentsList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CommentListResponse> = {}) {
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
