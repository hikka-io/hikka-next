import {
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
} from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting ignored notification types
 */
export function useIgnoredNotifications(
    options?: Omit<
        UseQueryOptions<
            IgnoredNotificationsResponse,
            Error,
            IgnoredNotificationsResponse
        >,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        options: options || {},
    });
}

/**
 * Function for prefetching ignored notification types
 */
export async function prefetchIgnoredNotifications(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<
            IgnoredNotificationsResponse,
            Error,
            IgnoredNotificationsResponse
        >,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        options: options || {},
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
