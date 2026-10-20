import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

import { notificationSeen, notifications } from '@hikka/api';
import { apiErrorMessage, type SeenTarget } from '@hikka/core';

import { applyNotificationsSeen } from '@/utils/api/invalidate-content-state';

const MARK_ERROR = 'Не вдалося позначити сповіщення прочитаними';

const markSeen = async ({ reference }: SeenTarget) => {
    await notificationSeen({
        path: { notification_reference: reference },
        throwOnError: true,
    });
};

// The backend marks the notification and every older one, so opening a row marks the rows below it too.
export function useMarkNotificationSeen() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markSeen,
        onSuccess: (_data, target) =>
            applyNotificationsSeen(queryClient, target),
    });
}

export function useMarkAllNotificationsSeen() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await notifications({
                query: { page: 1, size: 1 },
                throwOnError: true,
            });
            const newest = data.list[0];
            if (!newest) return null;

            await markSeen(newest);

            return newest;
        },
        onSuccess: async (newest) => {
            if (newest) await applyNotificationsSeen(queryClient, newest);

            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
        },
        onError: (error) => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error,
            );
            toast.error(apiErrorMessage(error, MARK_ERROR));
        },
    });
}
