import {
    commentListOptions,
    commentThreadOptions,
    contentCommentsOptions,
    latestCommentsOptions,
} from '@/options/api/comments';
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
}: PrefetchInfiniteQueryParams & UseCommentListParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            commentListOptions(client, { paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches a comment thread for server-side rendering
 */
export async function prefetchCommentThread({
    commentReference,
    ...rest
}: PrefetchQueryParams & UseCommentThreadParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            commentThreadOptions(client, { commentReference }),
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
}: PrefetchInfiniteQueryParams & UseContentCommentsParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            contentCommentsOptions(client, {
                contentType,
                slug,
                paginationArgs,
            }),
        ...rest,
    });
}

/**
 * Prefetches latest comments for server-side rendering
 */
export async function prefetchLatestComments({
    ...rest
}: PrefetchQueryParams & UseLatestCommentsParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => latestCommentsOptions(client),
        ...rest,
    });
}
