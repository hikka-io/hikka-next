import {
    CommentArgs,
    CommentTextArgs,
    CommentsContentType,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

type WriteCommentVariables = {
    contentType: CommentsContentType;
    slug: string;
    args: CommentArgs;
};

/**
 * Hook for writing a comment
 */
export const useWriteComment = createMutation({
    mutationFn: (client, { contentType, slug, args }: WriteCommentVariables) =>
        client.comments.createComment(contentType, slug, args),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.comments.content(contentType, slug),
    ],
});

type EditCommentVariables = {
    commentReference: string;
    args: CommentTextArgs;
};

/**
 * Hook for editing a comment
 */
export const useEditComment = createMutation({
    mutationFn: (client, { commentReference, args }: EditCommentVariables) =>
        client.comments.updateComment(commentReference, args),
    invalidateQueries: ({ commentReference }) => [
        queryKeys.comments.thread(commentReference),
    ],
});

/**
 * Hook for hiding/deleting a comment
 */
export const useHideComment = createMutation({
    mutationFn: (client, commentReference: string) =>
        client.comments.deleteComment(commentReference),
    invalidateQueries: (commentReference) => [
        queryKeys.comments.thread(commentReference),
        queryKeys.comments.list(),
    ],
});
