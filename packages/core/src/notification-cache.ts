import type { QueryClient } from '@tanstack/query-core';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
} from './content-cache';
import { queryId } from './query-id';

const NOTIFICATION_LIST_ID = 'notifications';
const NOTIFICATION_COUNT_ID = 'unseenNotificationsCount';

const NOTIFICATION_LIST_IDS = new Set([NOTIFICATION_LIST_ID]);

type NotificationPage = {
    list: { reference: string; seen: boolean; created: number }[];
};
type NotificationPages = { pages: NotificationPage[] };

const isNotificationPages = (data: unknown): data is NotificationPages =>
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as NotificationPages).pages);

/** Invalidate the notification list and the unseen count. */
export function invalidateNotifications(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(
        queryClient,
        [NOTIFICATION_LIST_ID, NOTIFICATION_COUNT_ID],
        options,
    );
}

/** Mark every entry created at or before `upTo` seen in an infinite notification list; the same object when nothing changes. */
export function patchNotificationsSeen(data: unknown, upTo: number): unknown {
    if (!isNotificationPages(data)) return data;

    let changed = false;
    const pages = data.pages.map((page) => {
        let pageChanged = false;
        const list = page.list.map((item) => {
            if (item.seen || item.created > upTo) return item;
            pageChanged = true;
            return { ...item, seen: true };
        });
        if (!pageChanged) return page;
        changed = true;
        return { ...page, list };
    });

    return changed ? { ...data, pages } : data;
}

function unseenInLists(queryClient: QueryClient, upTo: number): number {
    const unseen = new Set<string>();
    for (const [, data] of queryClient.getQueriesData<unknown>({
        predicate: (query) => queryId(query.queryKey) === NOTIFICATION_LIST_ID,
    })) {
        if (!isNotificationPages(data)) continue;
        for (const page of data.pages) {
            for (const item of page.list) {
                if (!item.seen && item.created <= upTo) {
                    unseen.add(item.reference);
                }
            }
        }
    }

    return unseen.size;
}

/**
 * After the backend marked a notification seen. It marks that one and every older one of the
 * user, so every cached entry created at or before `upTo` flips, the cached unseen count drops
 * by the entries that were unseen there, and the count is read again (uncached pages may have
 * held unseen entries too).
 */
export function applyNotificationsSeen(
    queryClient: QueryClient,
    upTo: number,
): Promise<void> {
    const flipped = unseenInLists(queryClient, upTo);

    patchQueries(queryClient, NOTIFICATION_LIST_IDS, (data) =>
        patchNotificationsSeen(data, upTo),
    );

    if (flipped > 0) {
        queryClient.setQueriesData<{ unseen: number }>(
            {
                predicate: (query) =>
                    queryId(query.queryKey) === NOTIFICATION_COUNT_ID,
            },
            (count) =>
                count
                    ? { ...count, unseen: Math.max(0, count.unseen - flipped) }
                    : count,
        );
    }

    return invalidateByIds(queryClient, [NOTIFICATION_COUNT_ID]);
}
