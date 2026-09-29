import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    type CommentResponse,
    editCommentMutation,
    type ReviewArgs,
} from '@hikka/api';

import { invalidateComments } from '@/utils/api/invalidate-content-state';

type Params = {
    comment: CommentResponse;
    onOpenChange: (open: boolean) => void;
    successMessage: string;
};

type Result = {
    convert: (review: ReviewArgs | null) => void;
    isPending: boolean;
};

/**
 * Flips a comment between plain and review by resending its text with a new
 * review payload — `null` drops the review, the backend deletes the row.
 */
export function useReviewConversion({
    comment,
    onOpenChange,
    successMessage,
}: Params): Result {
    const queryClient = useQueryClient();

    // No onError: the global MutationCache toast in router.tsx already covers it.
    const mutation = useMutation({
        ...editCommentMutation(),
        onSuccess: () => {
            invalidateComments(queryClient);
            onOpenChange(false);
            toast.success(successMessage);
        },
    });

    const convert = (review: ReviewArgs | null) => {
        if (!comment.text) return;

        mutation.mutate({
            path: { comment_reference: comment.reference },
            body: { text: comment.text, review },
        });
    };

    return { convert, isPending: mutation.isPending };
}
