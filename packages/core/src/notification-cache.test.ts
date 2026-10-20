import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import {
    applyNotificationsSeen,
    invalidateNotifications,
    patchNotificationsSeen,
} from './notification-cache';

const LIST_KEY = [{ _id: 'notifications' }];
const COUNT_KEY = [{ _id: 'unseenNotificationsCount' }];

const item = (reference: string, seen: boolean) => ({ reference, seen });

const seed = (queryClient: QueryClient) => {
    queryClient.setQueryData(LIST_KEY, {
        pages: [
            { list: [item('a', false), item('b', true)] },
            { list: [item('c', false)] },
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
    it('flips only the named unseen entries and leaves other data alone', () => {
        const data = {
            pages: [{ list: [item('a', false), item('c', false)] }],
        };

        expect(patchNotificationsSeen(data, new Set(['a']))).toEqual({
            pages: [{ list: [item('a', true), item('c', false)] }],
        });
        expect(patchNotificationsSeen(data, new Set(['x']))).toBe(data);
        expect(patchNotificationsSeen(undefined, new Set(['a']))).toBe(
            undefined,
        );
    });
});

describe('applyNotificationsSeen', () => {
    it('flips the cached entries and lowers the cached count', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, ['a']);

        expect(seenOf(queryClient)).toEqual([true, true, false]);
        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 4 });
    });

    it('does not lower the count for an entry that was already seen', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, ['b']);

        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 5 });
    });

    it('marks many entries at once and never goes below zero', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);
        queryClient.setQueryData(COUNT_KEY, { unseen: 1 });

        await applyNotificationsSeen(queryClient, ['a', 'c']);

        expect(seenOf(queryClient)).toEqual([true, true, true]);
        expect(queryClient.getQueryData(COUNT_KEY)).toEqual({ unseen: 0 });
    });

    it('stale-marks the count so it is read again', async () => {
        const queryClient = new QueryClient();
        seed(queryClient);

        await applyNotificationsSeen(queryClient, ['a']);

        expect(queryClient.getQueryState(COUNT_KEY)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(LIST_KEY)?.isInvalidated).toBe(false);
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
