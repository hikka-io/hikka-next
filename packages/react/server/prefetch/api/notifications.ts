import {
    NotificationPaginationResponse,
    NotificationUnseenResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';

/**
 * Prefetches notifications for server-side rendering
 */
export async function prefetchNotificationList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<NotificationPaginationResponse> = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotificationList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches unseen notifications count for server-side rendering
 */

export async function prefetchUnseenNotificationsCount({
    ...rest
}: PrefetchQueryParams<NotificationUnseenResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.notifications.unseenCount(),
        queryFn: (client) => client.notifications.getNotificationUnseenCount(),
        ...rest,
    });
}
