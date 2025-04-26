'use client';

import {
    NotificationPaginationResponse,
    NotificationUnseenResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';

/**
 * Hook for retrieving notifications
 */
export function useNotificationList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<NotificationPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotificationList({
                page,
                size: paginationArgs?.size,
            }),
        options: {
            authProtected: true,
            ...rest.options,
        },
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
        queryFn: (client) => client.notifications.getNotificationUnseenCount(),
        options: {
            authProtected: true,
            ...rest.options,
        },
        ...rest,
    });
}

/**
 * Hook for marking a notification as seen
 */
export const useUpdateNotificationSeen = createMutation({
    mutationFn: (client, reference: string) =>
        client.notifications.updateNotificationSeen(reference),
    invalidateQueries: () => [
        queryKeys.notifications.all,
        queryKeys.notifications.unseenCount(),
    ],
});
