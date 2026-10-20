import type { QueryClient } from '@tanstack/query-core';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
} from './content-cache';
import { queryId } from './query-id';

export const NOTIFICATION_LIST_ID = 'notifications';
export const NOTIFICATION_COUNT_ID = 'unseenNotificationsCount';

const NOTIFICATION_LIST_IDS = new Set([NOTIFICATION_LIST_ID]);

type NotificationPage = {
    list: { reference: string; seen: boolean; created: number }[];
};
type NotificationPages = { pages: NotificationPage[] };

const isNotificationPages = (data: unknown): data is NotificationPages =>
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as NotificationPages).pages);

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

export type SeenTarget = { reference: string; created: number };

// The backend compares microsecond timestamps; `created` is whole seconds, so same-second siblings are not flipped.
const isMarked = (
    item: { reference: string; created: number },
    target: SeenTarget,
) => item.created < target.created || item.reference === target.reference;

export function patchNotificationsSeen(
    data: unknown,
    target: SeenTarget,
): unknown {
    if (!isNotificationPages(data)) return data;

    let changed = false;
    const pages = data.pages.map((page) => {
        let pageChanged = false;
        const list = page.list.map((item) => {
            if (item.seen || !isMarked(item, target)) return item;
            pageChanged = true;
            return { ...item, seen: true };
        });
        if (!pageChanged) return page;
        changed = true;
        return { ...page, list };
    });

    return changed ? { ...data, pages } : data;
}

function unseenInLists(queryClient: QueryClient, target: SeenTarget): number {
    const unseen = new Set<string>();
    for (const [, data] of queryClient.getQueriesData<unknown>({
        predicate: (query) => queryId(query.queryKey) === NOTIFICATION_LIST_ID,
    })) {
        if (!isNotificationPages(data)) continue;
        for (const page of data.pages) {
            for (const item of page.list) {
                if (!item.seen && isMarked(item, target)) {
                    unseen.add(item.reference);
                }
            }
        }
    }

    return unseen.size;
}

// Mirrors the backend: the target and older entries flip, the count drops, the list goes stale.
export async function applyNotificationsSeen(
    queryClient: QueryClient,
    target: SeenTarget,
): Promise<void> {
    const flipped = unseenInLists(queryClient, target);

    patchQueries(queryClient, NOTIFICATION_LIST_IDS, (data) =>
        patchNotificationsSeen(data, target),
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

    await Promise.all([
        invalidateByIds(queryClient, [NOTIFICATION_LIST_ID], {
            refetch: false,
        }),
        invalidateByIds(queryClient, [NOTIFICATION_COUNT_ID]),
    ]);
}
