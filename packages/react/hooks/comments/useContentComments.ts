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
    contentType: CommentsContentTypeEnum;
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting comments for a specific content
 */
export function useContentComments(params: UseContentCommentsOptions) {
    const { contentType, slug, page = 1, size = 15, ...queryOptions } = params;

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

export interface PrefetchContentCommentsParams
    extends UseContentCommentsOptions {
    queryClient: QueryClient;
}

export async function prefetchContentComments(
    params: PrefetchContentCommentsParams,
) {
    const {
        queryClient,
        contentType,
        slug,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.comments.content(contentType, slug),
        (client) =>
            client.comments.getContentComments(contentType, slug, page, size),
        queryOptions,
    );
}
