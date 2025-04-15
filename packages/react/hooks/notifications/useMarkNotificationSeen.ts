import { NotificationResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type MarkNotificationSeenVariables = {
    reference: string;
};

/**
 * Hook for marking a notification as seen
 */
export function useMarkNotificationSeen(
    options?: Omit<
        UseMutationOptions<
            NotificationResponse,
            Error,
            MarkNotificationSeenVariables
        >,
        'mutationFn'
    >,
): UseMutationResult<
    NotificationResponse,
    Error,
    MarkNotificationSeenVariables
> {
    return createMutation<
        NotificationResponse,
        Error,
        MarkNotificationSeenVariables
    >(
        (client, { reference }) => client.notifications.markAsSeen(reference),
        (variables) => [
            queryKeys.notifications.list(),
            queryKeys.notifications.unseenCount(),
            queryKeys.notifications.markAsSeen(variables.reference),
        ],
    )(options);
}
