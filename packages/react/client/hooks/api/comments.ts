'use client';

import {
    CommentArgs,
    CommentListResponse,
    CommentResponse,
    CommentTextArgs,
    CommentsContentType,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    commentListOptions,
    commentThreadOptions,
    contentCommentsOptions,
    latestCommentsOptions,
} from '@/options/api/comments';
import {
    UseCommentListParams,
    UseCommentThreadParams,
    UseContentCommentsParams,
    UseLatestCommentsParams,
} from '@/types/comments';

/**
 * Hook for retrieving a user's comments list
 */
export function useCommentList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<CommentListResponse> & UseCommentListParams = {}) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        commentListOptions(client, { paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for retrieving comments for a specific content
 */
export function useContentComments({
    contentType,
    slug,
    paginationArgs,
    ...rest
}: UseContentCommentsParams & InfiniteQueryParams<CommentListResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        contentCommentsOptions(client, { contentType, slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for retrieving latest comments
 */
export function useLatestComments({
    ...rest
}: QueryParams<CommentResponse[]> & UseLatestCommentsParams = {}) {
    const { client } = useHikkaClient();
    return useQuery({
        ...latestCommentsOptions(client),
        ...rest,
    });
}

/**
 * Hook for retrieving a comment thread
 */
export function useCommentThread({
    commentReference,
    ...rest
}: UseCommentThreadParams & QueryParams<CommentResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...commentThreadOptions(client, { commentReference }),
        ...rest,
    });
}

type WriteCommentVariables = {
    contentType: CommentsContentType;
    slug: string;
    args: CommentArgs;
};

/**
 * Hook for writing a comment
 */
export const useCreateComment = createMutation({
    mutationFn: (client, { contentType, slug, args }: WriteCommentVariables) =>
        client.comments.createComment(contentType, slug, args),
    invalidateQueries: ({ contentType, slug }) => [queryKeys.comments.all],
});

type EditCommentVariables = {
    commentReference: string;
    args: CommentTextArgs;
};

/**
 * Hook for editing a comment
 */
export const useUpdateComment = createMutation({
    mutationFn: (client, { commentReference, args }: EditCommentVariables) =>
        client.comments.updateComment(commentReference, args),
    invalidateQueries: ({ commentReference }) => [queryKeys.comments.all],
});

/**
 * Hook for hiding/deleting a comment
 */
export const useDeleteComment = createMutation({
    mutationFn: (client, commentReference: string) =>
        client.comments.deleteComment(commentReference),
    invalidateQueries: (commentReference) => [queryKeys.comments.all],
});
