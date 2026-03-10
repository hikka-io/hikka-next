import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';

export function notificationListOptions(
    client: HikkaClient,
    { paginationArgs }: { paginationArgs?: PaginationArgs } = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.notifications.list(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.notifications.getNotificationList({
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

export function unseenNotificationsCountOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.notifications.unseenCount(),
        queryFn: () => client.notifications.getNotificationUnseenCount(),
    });
}
