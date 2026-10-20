import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

import { notificationSeen } from '@hikka/api';
import { apiErrorMessage } from '@hikka/core';

import { applyNotificationsSeen } from '@/utils/api/invalidate-content-state';

const MARK_ERROR = 'Не вдалося позначити сповіщення прочитаними';

export type SeenTarget = { reference: string; created: number };

/**
 * The backend marks the given notification and every older one of the user as seen (so
 * "mark all" is the newest one), and the cache write mirrors that.
 */
export function useMarkNotificationsSeen({ notify = false } = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reference }: SeenTarget) => {
            await notificationSeen({
                path: { notification_reference: reference },
                throwOnError: true,
            });
        },
        onSuccess: async (_data, { created }) => {
            await applyNotificationsSeen(queryClient, created);

            if (notify) {
                void Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                );
            }
        },
        onError: (error) => {
            if (!notify) return;

            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error,
            );
            toast.error(apiErrorMessage(error, MARK_ERROR));
        },
    });
}
