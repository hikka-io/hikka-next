import { CommentResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving latest comments
 */
export function useLatestComments(
    options?: Omit<
        UseQueryOptions<CommentResponse[], Error, CommentResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.comments.latest(),
        queryFn: (client) => client.comments.getLatest(),
        options: options || {},
    });
}

/**
 * Prefetches latest comments for server-side rendering
 */
export async function prefetchLatestComments(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<CommentResponse[], Error, CommentResponse[]>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.comments.latest(),
        queryFn: (client) => client.comments.getLatest(),
        options,
    });
}
