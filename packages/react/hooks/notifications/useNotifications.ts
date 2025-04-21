import {
    NotificationPaginationResponse,
    NotificationUnseenResponse,
    PaginationArgs,
} from '@hikka/client';
import {
    FetchInfiniteQueryOptions,
    FetchQueryOptions,
    QueryClient,
} from '@tanstack/query-core';
import {
    UseInfiniteQueryOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useInfiniteQuery } from '../../core/useInfiniteQuery';
import { useQuery } from '../../core/useQuery';
import { prefetchInfiniteQuery } from '../../server/prefetchInfiniteQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving notifications
 */
export function useNotifications(
    paginationArgs?: PaginationArgs,
    options?: Omit<
        UseInfiniteQueryOptions<
            NotificationPaginationResponse,
            Error,
            NotificationPaginationResponse,
            NotificationPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return useInfiniteQuery({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotifications({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Prefetches notifications for server-side rendering
 */
export async function prefetchNotifications(
    queryClient: QueryClient,
    paginationArgs?: PaginationArgs,
    options?: Omit<
        FetchInfiniteQueryOptions<
            NotificationPaginationResponse,
            Error,
            NotificationPaginationResponse,
            readonly unknown[],
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    >,
) {
    return prefetchInfiniteQuery({
        queryClient,
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.notifications.getNotifications({
                page,
                size: paginationArgs?.size,
            }),
        options,
    });
}

/**
 * Hook for retrieving unseen notifications count
 */
export function useUnseenNotificationsCount(
    options?: Omit<
        UseQueryOptions<
            NotificationUnseenResponse,
            Error,
            NotificationUnseenResponse
        >,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.notifications.unseenCount(),
        queryFn: (client) => client.notifications.getUnseenCount(),
        options: options || {},
    });
}

/**
 * Prefetches unseen notifications count for server-side rendering
 */
export async function prefetchUnseenNotificationsCount(
    queryClient: QueryClient,
    options?: Omit<
        FetchQueryOptions<
            NotificationUnseenResponse,
            Error,
            NotificationUnseenResponse
        >,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.notifications.unseenCount(),
        queryFn: (client) => client.notifications.getUnseenCount(),
        options,
    });
}
