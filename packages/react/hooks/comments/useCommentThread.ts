import { CommentResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseCommentThreadParams {
    commentReference: string;
}

/**
 * Hook for retrieving a comment thread
 */
export function useCommentThread({
    commentReference,
    ...rest
}: UseCommentThreadParams & QueryParams<CommentResponse>) {
    return useQuery({
        queryKey: queryKeys.comments.thread(commentReference),
        queryFn: (client) => client.comments.getCommentThread(commentReference),
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
