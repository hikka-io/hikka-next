import type { Query } from '@tanstack/react-query';

import {
    notificationsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import { queryId } from '@hikka/core';

export const NOTIFICATIONS_PAGE_SIZE = 20;

export function notificationsOptions() {
    return paginatedInfiniteOptions(
        notificationsInfiniteOptions({
            query: { size: NOTIFICATIONS_PAGE_SIZE },
        }),
    );
}

const NOTIFICATION_QUERY_IDS = new Set([
    'notifications',
    'unseenNotificationsCount',
]);

export const isNotificationQuery = (query: Query) =>
    NOTIFICATION_QUERY_IDS.has(queryId(query.queryKey) ?? '');
