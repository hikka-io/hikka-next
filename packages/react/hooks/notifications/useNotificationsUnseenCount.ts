import { NotificationUnseenResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseNotificationsUnseenCountOptions
    extends Omit<
        UseQueryOptions<
            NotificationUnseenResponse,
            Error,
            NotificationUnseenResponse,
            ReturnType<typeof queryKeys.notifications.unseenCount>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting unseen notifications count
 */
export function useNotificationsUnseenCount(
    options: UseNotificationsUnseenCountOptions = {},
) {
    return useQuery(
        queryKeys.notifications.unseenCount(),
        (client) => client.notifications.getUnseenCount(),
        options,
    );
}

export async function prefetchNotificationsUnseenCount(
    queryClient: QueryClient,
    options: UseNotificationsUnseenCountOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.notifications.unseenCount(),
        (client) => client.notifications.getUnseenCount(),
        options,
    );
}
