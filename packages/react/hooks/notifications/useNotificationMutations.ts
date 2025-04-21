import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for marking a notification as seen
 */
export const useMarkNotificationAsSeen = createMutation({
    mutationFn: (client, reference: string) =>
        client.notifications.markAsSeen(reference),
    invalidateQueries: () => [
        queryKeys.notifications.all,
        queryKeys.notifications.unseenCount(),
    ],
});
