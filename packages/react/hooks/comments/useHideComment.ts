import { SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type HideCommentVariables = {
    commentReference: string;
};

/**
 * Hook for hiding/deleting a comment
 */
export function useHideComment(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, HideCommentVariables>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, HideCommentVariables> {
    return createMutation<SuccessResponse, Error, HideCommentVariables>(
        (client, { commentReference }) =>
            client.comments.hide(commentReference),
        () => [
            // Invalidate all comments-related queries
            queryKeys.comments.latest(),
            queryKeys.comments.list(),
            // Note: we don't know the content type and slug here,
            // so we can't invalidate specific content comments
        ],
    )(options);
}
