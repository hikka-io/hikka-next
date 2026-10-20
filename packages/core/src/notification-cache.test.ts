import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import {
    applyNotificationsSeen,
    invalidateNotifications,
    patchNotificationsSeen,
} from './notification-cache';

const LIST_KEY = [{ _id: 'notifications' }];
const COUNT_KEY = [{ _id: 'unseenNotificationsCount' }];

const item = (reference: string, created: number, seen: boolean) => ({
    reference,
    created,
    seen,
});

// Newest first, like the API: c (30) and a (20) are unseen, b (10) is seen, d (5) is unseen.
const seed = (queryClient: QueryClient) => {
    queryClient.setQueryData(LIST_KEY, {
        pages: [
            { list: [item('c', 30, false), item('a', 20, false)] },
            { list: [item('b', 10, true), item('d', 5, false)] },
        ],
        pageParams: [1, 2],
    });
    queryClient.setQueryData(COUNT_KEY, { unseen: 5 });
};

const seenOf = (queryClient: QueryClient) =>
    (
        queryClient.getQueryData(LIST_KEY) as {
            pages: { list: { seen: boolean }[] }[];
        }
    ).pages.flatMap((page) => page.list.map((entry) => entry.seen));

describe('patchNotificationsSeen', () => {
    it('flips the unseen entries at or before the mark and leaves other data alone', () => {
        const data = {
            pages: [{ list: [item('a', 20, false), item('d', 5, false)] }],
        };

        expect(
            patchNotificationsSeen(data, { reference: 'd', created: 5 }),
        ).toEqual({
            pages: [{ list: [item('a', 20, false), item('d', 5, true)] }],
        });
        expect(
            patchNotificationsSeen(data, { reference: 'x', created: 1 }),
        ).toBe(data);
        expect(
            patchNotificationsSeen(undefined, { reference: 'd', created: 5 }),
        ).toBe(undefined);
    });
});

describe('applyNotificationsSeen', () => {
    it('marks the entry and every older one, like the backend', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, {
            reference: 'a',
            created: 20,
        });

        expect(seenOf(queryClient)).toEqual([false, true, true, true]);
        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 3 });
    });

    it('leaves the count alone when no cached entry flips', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, {
            reference: 'zz',
            created: 4,
        });

        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 5 });
    });

    it('never goes below zero', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);
        queryClient.setQueryData(COUNT_KEY, { unseen: 1 });

        await applyNotificationsSeen(queryClient, {
            reference: 'c',
            created: 30,
        });

        expect(seenOf(queryClient)).toEqual([true, true, true, true]);
        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 0 });
    });

    it('flips only the marked entry among same-second ones', async () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(LIST_KEY, {
            pages: [
                {
                    list: [
                        item('x', 20, false),
                        item('y', 20, false),
                        item('z', 20, false),
                    ],
                },
            ],
            pageParams: [1],
        });
        queryClient.setQueryData(COUNT_KEY, { unseen: 3 });

        await applyNotificationsSeen(queryClient, {
            reference: 'z',
            created: 20,
        });

        expect(seenOf(queryClient)).toEqual([false, false, true]);
        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 2 });
    });

    it('stale-marks the list and the count without refetching', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, {
            reference: 'a',
            created: 20,
        });

        expect(queryClient.getQueryState(COUNT_KEY)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(true);
    });
});

describe('invalidateNotifications', () => {
    it('stale-marks the list and the count', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await invalidateNotifications(queryClient);

        expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(COUNT_KEY)?.isInvalidated).toBe(true);
    });
});
