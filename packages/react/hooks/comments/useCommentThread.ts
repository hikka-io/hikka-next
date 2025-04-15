import { CommentResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCommentThreadOptions
    extends Omit<
        UseQueryOptions<
            CommentResponse,
            Error,
            CommentResponse,
            ReturnType<typeof queryKeys.comments.thread>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting a comment thread
 */
export function useCommentThread(
    reference: string,
    options: UseCommentThreadOptions = {},
) {
    return useQuery(
        queryKeys.comments.thread(reference),
        (client) => client.comments.getThread(reference),
        {
            enabled: !!reference,
            ...options,
        },
    );
}

export async function prefetchCommentThread(
    queryClient: QueryClient,
    reference: string,
    options: UseCommentThreadOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.comments.thread(reference),
        (client) => client.comments.getThread(reference),
        options,
    );
}
