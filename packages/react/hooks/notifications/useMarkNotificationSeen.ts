import { NotificationResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type MarkNotificationSeenVariables = {
    reference: string;
};

export interface UseMarkNotificationSeenOptions
    extends Omit<
        UseMutationOptions<
            NotificationResponse,
            Error,
            MarkNotificationSeenVariables
        >,
        'mutationFn'
    > {}

/**
 * Hook for marking a notification as seen
 */
export function useMarkNotificationSeen(
    params: UseMarkNotificationSeenOptions = {},
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
    )(params);
}
