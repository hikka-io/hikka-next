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
export function useLatestComments(options: UseLatestCommentsOptions = {}) {
    return useQuery(
        queryKeys.comments.latest(),
        (client) => client.comments.getLatest(),
        options,
    );
}

export async function prefetchLatestComments(
    queryClient: QueryClient,
    options: UseLatestCommentsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.comments.latest(),
        (client) => client.comments.getLatest(),
        options,
    );
}
