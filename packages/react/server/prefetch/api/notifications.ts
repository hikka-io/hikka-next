import {
    notificationListOptions,
    unseenNotificationsCountOptions,
} from '@/options/api/notifications';
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
}: PrefetchInfiniteQueryParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            notificationListOptions(client, { paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches unseen notifications count for server-side rendering
 */

export async function prefetchUnseenNotificationsCount({
    ...rest
}: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => unseenNotificationsCountOptions(client),
        ...rest,
    });
}
