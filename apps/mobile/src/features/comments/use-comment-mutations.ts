import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

import {
    type CommentResponse,
    editCommentMutation,
    hideCommentMutation,
    setVote,
    VoteContentTypeEnum,
    writeCommentMutation,
} from '@hikka/api';
import { apiErrorMessage } from '@hikka/core';

import { isDeadTokenError, signOut, useSession } from '@/features/auth';
import {
    applyCommentVote,
    invalidateComments,
} from '@/utils/api/invalidate-content-state';

const failed = (error: unknown, fallback: string) => {
    if (isDeadTokenError(error)) {
        void signOut();
        return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    toast.error(apiErrorMessage(error, fallback));
};

type VoteVariables = { reference: string; score: number; previous: number };

/**
 * Optimistic: the cached comment changes at once and rolls back if the request fails.
 * Everything comes from the variables, never the render: FlashList reuses this hook's
 * component for another comment while a request is in flight. Votes on one comment run in order.
 */
export function useCommentVote(comment: CommentResponse) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { hasToken } = useSession();

    const mutation = useMutation({
        scope: { id: `vote:${comment.reference}` },
        mutationFn: async ({ reference, score }: VoteVariables) => {
            const { data } = await setVote({
                path: {
                    content_type: VoteContentTypeEnum.COMMENT,
                    slug: reference,
                },
                body: { score },
                throwOnError: true,
            });
            return data;
        },
        onMutate: ({ reference, score }) => {
            void applyCommentVote(queryClient, reference, score);
        },
        onSuccess: (data, { reference }) =>
            applyCommentVote(queryClient, reference, data.score),
        onError: (error, { reference, previous }) => {
            void applyCommentVote(queryClient, reference, previous);
            failed(error, 'Не вдалося проголосувати');
        },
    });

    const vote = (score: 1 | -1) => {
        if (!hasToken) {
            router.push('/login');
            return;
        }

        void Haptics.selectionAsync();
        mutation.mutate({
            reference: comment.reference,
            score: comment.my_score === score ? 0 : score,
            previous: comment.my_score,
        });
    };

    return vote;
}

export function useWriteComment(onSuccess: (comment: CommentResponse) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        ...writeCommentMutation(),
        onSuccess: (comment) => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
            void invalidateComments(queryClient);
            onSuccess(comment);
        },
        onError: (error) => failed(error, 'Не вдалося надіслати коментар'),
    });
}

export function useEditComment(onSuccess: (comment: CommentResponse) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        ...editCommentMutation(),
        onSuccess: (comment) => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
            void invalidateComments(queryClient);
            onSuccess(comment);
        },
        onError: (error) => failed(error, 'Не вдалося зберегти коментар'),
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        ...hideCommentMutation(),
        onSuccess: () => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
            void invalidateComments(queryClient);
        },
        onError: (error) =>
            failed(
                error,
                'Виникла помилка при видаленні повідомлення. Спробуйте, будь ласка, ще раз',
            ),
    });
}
