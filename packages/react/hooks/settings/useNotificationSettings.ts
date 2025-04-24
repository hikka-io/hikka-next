import {
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting ignored notification types
 */
export function useIgnoredNotifications({
    ...rest
}: QueryParams<IgnoredNotificationsResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        ...rest,
    });
}

/**
 * Function for prefetching ignored notification types
 */
export async function prefetchIgnoredNotifications({
    ...rest
}: PrefetchQueryParams<IgnoredNotificationsResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        ...rest,
    });
}

/**
 * Hook for updating ignored notification types
 */
export const useUpdateIgnoredNotifications = createMutation({
    mutationFn: (client, args: IgnoredNotificationsArgs) =>
        client.settings.updateIgnoredNotifications(args),
    invalidateQueries: () => [queryKeys.settings.ignoredNotifications()],
});
