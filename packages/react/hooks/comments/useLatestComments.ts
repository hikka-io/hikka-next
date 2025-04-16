import { CommentResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseLatestCommentsOptions
    extends Omit<
        UseQueryOptions<
            CommentResponse[],
            Error,
            CommentResponse[],
            ReturnType<typeof queryKeys.comments.latest>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting latest comments
 */
export function useLatestComments(params: UseLatestCommentsOptions = {}) {
    return useQuery(
        queryKeys.comments.latest(),
        (client) => client.comments.getLatest(),
        params,
    );
}

export interface PrefetchLatestCommentsParams extends UseLatestCommentsOptions {
    queryClient: QueryClient;
}

export async function prefetchLatestComments(
    params: PrefetchLatestCommentsParams,
) {
    const { queryClient, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.comments.latest(),
        (client) => client.comments.getLatest(),
        options,
    );
}
