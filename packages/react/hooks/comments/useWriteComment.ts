import {
    CommentArgs,
    CommentResponse,
    CommentsContentTypeEnum,
} from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type WriteCommentVariables = {
    contentType: CommentsContentTypeEnum;
    slug: string;
    args: CommentArgs;
};

export interface UseWriteCommentOptions
    extends Omit<
        UseMutationOptions<CommentResponse, Error, WriteCommentVariables>,
        'mutationFn'
    > {}

/**
 * Hook for writing a comment
 */
export function useWriteComment(
    params: UseWriteCommentOptions = {},
): UseMutationResult<CommentResponse, Error, WriteCommentVariables> {
    return createMutation<CommentResponse, Error, WriteCommentVariables>(
        (client, { contentType, slug, args }) =>
            client.comments.write(contentType, slug, args),
        (variables) => [
            // Invalidate content comments
            queryKeys.comments.content(variables.contentType, variables.slug),
            // Invalidate latest comments
            queryKeys.comments.latest(),
            // Invalidate comments list
            queryKeys.comments.list(),
        ],
    )(params);
}
