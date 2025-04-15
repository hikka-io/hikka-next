import { CommentListResponse, CommentsContentTypeEnum } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseContentCommentsOptions
    extends Omit<
        UseQueryOptions<
            CommentListResponse,
            Error,
            CommentListResponse,
            ReturnType<typeof queryKeys.comments.content>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting comments for a specific content
 */
export function useContentComments(
    contentType: CommentsContentTypeEnum,
    slug: string,
    options: UseContentCommentsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.comments.content(contentType, slug),
        (client) =>
            client.comments.getContentComments(contentType, slug, page, size),
        {
            enabled: !!contentType && !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchContentComments(
    queryClient: QueryClient,
    contentType: CommentsContentTypeEnum,
    slug: string,
    options: UseContentCommentsOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.comments.content(contentType, slug),
        (client) =>
            client.comments.getContentComments(contentType, slug, page, size),
        queryOptions,
    );
}
