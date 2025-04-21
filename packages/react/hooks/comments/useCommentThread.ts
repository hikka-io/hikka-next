import { CommentResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a comment thread
 */
export function useCommentThread(
    commentReference: string,
    options?: Omit<
        UseQueryOptions<CommentResponse, Error, CommentResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.comments.thread(commentReference),
        queryFn: (client) => client.comments.getThread(commentReference),
        options: options || {},
    });
}

/**
 * Prefetches a comment thread for server-side rendering
 */
export async function prefetchCommentThread(
    queryClient: QueryClient,
    commentReference: string,
    options?: Omit<
        FetchQueryOptions<CommentResponse, Error, CommentResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.comments.thread(commentReference),
        queryFn: (client) => client.comments.getThread(commentReference),
        options,
    });
}
