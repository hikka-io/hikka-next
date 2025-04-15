import { CommentResponse, CommentTextArgs } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type EditCommentVariables = {
    commentReference: string;
    args: CommentTextArgs;
};

/**
 * Hook for editing a comment
 */
export function useEditComment(
    options?: Omit<
        UseMutationOptions<CommentResponse, Error, EditCommentVariables>,
        'mutationFn'
    >,
): UseMutationResult<CommentResponse, Error, EditCommentVariables> {
    return createMutation<CommentResponse, Error, EditCommentVariables>(
        (client, { commentReference, args }) =>
            client.comments.edit(commentReference, args),
        () => [
            // Invalidate all comments-related queries
            queryKeys.comments.latest(),
            queryKeys.comments.list(),
            // Note: we don't know the content type and slug here,
            // so we can't invalidate specific content comments
        ],
    )(options);
}
