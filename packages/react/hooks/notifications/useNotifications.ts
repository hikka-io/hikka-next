import { NotificationPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseNotificationsOptions
    extends Omit<
        UseQueryOptions<
            NotificationPaginationResponse,
            Error,
            NotificationPaginationResponse,
            ReturnType<typeof queryKeys.notifications.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting user notifications
 */
export function useNotifications(params: UseNotificationsOptions = {}) {
    const { page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.notifications.list(),
        (client) => client.notifications.getNotifications(page, size),
        queryOptions,
    );
}

export interface PrefetchNotificationsParams extends UseNotificationsOptions {
    queryClient: QueryClient;
}

export async function prefetchNotifications(
    params: PrefetchNotificationsParams,
) {
    const { queryClient, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.notifications.list(),
        (client) => client.notifications.getNotifications(page, size),
        queryOptions,
    );
}
