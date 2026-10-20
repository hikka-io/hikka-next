import type { Query } from '@tanstack/react-query';

import {
    notificationsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import {
    NOTIFICATION_COUNT_ID,
    NOTIFICATION_LIST_ID,
    queryId,
} from '@hikka/core';

const NOTIFICATIONS_PAGE_SIZE = 20;

export function notificationsOptions() {
    return paginatedInfiniteOptions(
        notificationsInfiniteOptions({
            query: { size: NOTIFICATIONS_PAGE_SIZE },
        }),
    );
}

const NOTIFICATION_QUERY_IDS = new Set([
    NOTIFICATION_LIST_ID,
    NOTIFICATION_COUNT_ID,
]);

export const isNotificationQuery = (query: Query) =>
    NOTIFICATION_QUERY_IDS.has(queryId(query.queryKey) ?? '');
