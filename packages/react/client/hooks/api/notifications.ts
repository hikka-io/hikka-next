'use client';

import {
    NotificationPaginationResponse,
    NotificationUnseenResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    notificationListOptions,
    unseenNotificationsCountOptions,
} from '@/options/api/notifications';

/**
 * Hook for retrieving notifications
 */
export function useNotificationList({
    paginationArgs,
    options,
    ...rest
}: InfiniteQueryParams<NotificationPaginationResponse> = {}) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        notificationListOptions(client, { paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Hook for retrieving unseen notifications count
 */
export function useUnseenNotificationsCount({
    options,
    ...rest
}: QueryParams<NotificationUnseenResponse> = {}) {
    const { client } = useHikkaClient();
    return useQuery({
        ...unseenNotificationsCountOptions(client),
        options: {
            authProtected: true,
            ...options,
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
    invalidateQueries: () => [queryKeys.notifications.unseenCount()],
});
