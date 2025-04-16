import { IgnoredNotificationsResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseIgnoredNotificationsOptions
    extends Omit<
        UseQueryOptions<
            IgnoredNotificationsResponse,
            Error,
            IgnoredNotificationsResponse,
            ReturnType<typeof queryKeys.settings.ignoredNotifications>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting ignored notification types
 */
export function useIgnoredNotifications(
    options: UseIgnoredNotificationsOptions = {},
) {
    return useQuery(
        queryKeys.settings.ignoredNotifications(),
        (client) => client.settings.getIgnoredNotifications(),
        options,
    );
}

export interface PrefetchIgnoredNotificationsParams
    extends UseIgnoredNotificationsOptions {
    queryClient: QueryClient;
}

export async function prefetchIgnoredNotifications(
    params: PrefetchIgnoredNotificationsParams,
) {
    const { queryClient, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.settings.ignoredNotifications(),
        (client) => client.settings.getIgnoredNotifications(),
        options,
    );
}
