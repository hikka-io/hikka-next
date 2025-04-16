import { CommentResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    reference: string;
}

/**
 * Hook for getting a comment thread
 */
export function useCommentThread(params: UseCommentThreadOptions) {
    const { reference, ...options } = params;

    return useQuery(
        queryKeys.comments.thread(reference),
        (client) => client.comments.getThread(reference),
        {
            enabled: !!reference,
            ...options,
        },
    );
}

export interface PrefetchCommentThreadParams extends UseCommentThreadOptions {
    queryClient: QueryClient;
}

export async function prefetchCommentThread(
    params: PrefetchCommentThreadParams,
) {
    const { queryClient, reference, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.comments.thread(reference),
        (client) => client.comments.getThread(reference),
        options,
    );
}
