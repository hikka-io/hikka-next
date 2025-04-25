import { CommentResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving latest comments
 */
export function useLatestComments({
    ...rest
}: QueryParams<CommentResponse[]> = {}) {
    return useQuery({
        queryKey: queryKeys.comments.latest(),
        queryFn: (client) => client.comments.getLatestComments(),
        ...rest,
    });
}

/**
 * Prefetches latest comments for server-side rendering
 */
export async function prefetchLatestComments({
    ...rest
}: PrefetchQueryParams<CommentResponse[]> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.comments.latest(),
        queryFn: (client) => client.comments.getLatestComments(),
        ...rest,
    });
}
