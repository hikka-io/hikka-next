import { CommentListResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCommentsListOptions
    extends Omit<
        UseQueryOptions<
            CommentListResponse,
            Error,
            CommentListResponse,
            ReturnType<typeof queryKeys.comments.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's comments list
 */
export function useCommentsList(options: UseCommentsListOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.comments.list(),
        (client) => client.comments.getList(page, size),
        queryOptions,
    );
}

export async function prefetchCommentsList(
    queryClient: QueryClient,
    options: UseCommentsListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.comments.list(),
        (client) => client.comments.getList(page, size),
        queryOptions,
    );
}
