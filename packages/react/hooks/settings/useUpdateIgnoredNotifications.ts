import {
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
} from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for updating ignored notification types
 */
export function useUpdateIgnoredNotifications(
    options?: Omit<
        UseMutationOptions<
            IgnoredNotificationsResponse,
            Error,
            IgnoredNotificationsArgs
        >,
        'mutationFn'
    >,
): UseMutationResult<
    IgnoredNotificationsResponse,
    Error,
    IgnoredNotificationsArgs
> {
    return createMutation<
        IgnoredNotificationsResponse,
        Error,
        IgnoredNotificationsArgs
    >(
        (client, args) => client.settings.updateIgnoredNotifications(args),
        () => [
            // Invalidate ignored notifications
            queryKeys.settings.ignoredNotifications(),
        ],
    )(options);
}
