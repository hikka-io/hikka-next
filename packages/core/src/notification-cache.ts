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

type NotificationPage = { list: { reference: string; seen: boolean }[] };
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

/** Mark `references` seen in an infinite notification list; the same object when nothing changes. */
export function patchNotificationsSeen(
    data: unknown,
    references: ReadonlySet<string>,
): unknown {
    if (!isNotificationPages(data)) return data;

    let changed = false;
    const pages = data.pages.map((page) => {
        let pageChanged = false;
        const list = page.list.map((item) => {
            if (item.seen || !references.has(item.reference)) return item;
            pageChanged = true;
            return { ...item, seen: true };
        });
        if (!pageChanged) return page;
        changed = true;
        return { ...page, list };
    });

    return changed ? { ...data, pages } : data;
}

function unseenInLists(
    queryClient: QueryClient,
    references: ReadonlySet<string>,
): number {
    const unseen = new Set<string>();
    for (const [, data] of queryClient.getQueriesData<unknown>({
        predicate: (query) => queryId(query.queryKey) === NOTIFICATION_LIST_ID,
    })) {
        if (!isNotificationPages(data)) continue;
        for (const page of data.pages) {
            for (const item of page.list) {
                if (!item.seen && references.has(item.reference)) {
                    unseen.add(item.reference);
                }
            }
        }
    }

    return unseen.size;
}

/**
 * After the backend marked `references` seen: flip them in every cached list and lower the
 * cached unseen count by the entries that were unseen there, then refetch the count (older
 * pages that are not cached may hold unseen entries too).
 */
export function applyNotificationsSeen(
    queryClient: QueryClient,
    references: readonly string[],
): Promise<void> {
    const set = new Set(references);
    const flipped = unseenInLists(queryClient, set);

    patchQueries(queryClient, NOTIFICATION_LIST_IDS, (data) =>
        patchNotificationsSeen(data, set),
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
