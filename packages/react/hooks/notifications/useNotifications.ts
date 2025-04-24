import {
    NotificationPaginationResponse,
    NotificationUnseenResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import { QueryParams, useQuery } from '../../core/useQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving notifications
 */
export function useNotifications({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<NotificationPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotifications({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches notifications for server-side rendering
 */
export async function prefetchNotifications({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<NotificationPaginationResponse> = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotifications({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for retrieving unseen notifications count
 */
export function useUnseenNotificationsCount({
    ...rest
}: QueryParams<NotificationUnseenResponse> = {}) {
    return useQuery({
        queryKey: queryKeys.notifications.unseenCount(),
        queryFn: (client) => client.notifications.getUnseenCount(),
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
        queryFn: (client) => client.notifications.getUnseenCount(),
        ...rest,
    });
}
