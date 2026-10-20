import type { QueryFunctionContext } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import { HikkaApiError } from '@hikka/api';

import { localDateToUnix, unixToLocalDate } from './list-dates';
import { listEntryOptions, nullOn404 } from './list-entry';
import { completedReadFill, completedWatchFill } from './tracking-args';

const KEY = [{ _id: 'watchGet' }] as const;

const run = (queryFn: () => Promise<unknown>) =>
    nullOn404({ queryKey: KEY, queryFn }).queryFn(
        {} as QueryFunctionContext<typeof KEY>,
    );

describe('nullOn404', () => {
    it('resolves a 404 (not in the list) to null', async () => {
        await expect(
            run(async () => {
                throw new HikkaApiError('Not found', 404, 'watch:not-found');
            }),
        ).resolves.toBeNull();
    });

    it.each([400, 401, 422, 500])(
        'keeps a %i an error, never untracked',
        async (status) => {
            const error = new HikkaApiError('Error', status, 'error');
            await expect(
                run(async () => {
                    throw error;
                }),
            ).rejects.toBe(error);
        },
    );

    it('rethrows network failures', async () => {
        const error = new TypeError('Network request failed');
        await expect(
            run(async () => {
                throw error;
            }),
        ).rejects.toBe(error);
    });

    it('passes the entry through and keeps the key', async () => {
        const entry = { status: 'watching' };
        await expect(run(async () => entry)).resolves.toBe(entry);
        expect(nullOn404({ queryKey: KEY }).queryKey).toBe(KEY);
    });
});

describe('listEntryOptions', () => {
    it.each([
        ['anime', 'watchGet'],
        ['manga', 'readGet'],
        ['novel', 'readGet'],
    ] as const)('reads %s through %s', (type, id) => {
        const [key] = listEntryOptions(type, 'slug').queryKey as unknown as [
            { _id: string; path: Record<string, string> },
        ];
        expect(key._id).toBe(id);
        expect(key.path.slug).toBe('slug');
    });
});

describe('completed fill', () => {
    it('fills episodes from a known total', () => {
        expect(completedWatchFill({ episodes_total: 12 })).toEqual({
            episodes: 12,
        });
    });

    it('adds no key when the total is unknown, so carried progress survives', () => {
        expect(completedWatchFill({ episodes_total: null })).toEqual({});
        expect(completedWatchFill(undefined)).toEqual({});
    });

    it('fills chapters and volumes, falling back to the entry', () => {
        expect(
            completedReadFill(
                { chapters: 120, volumes: null },
                { chapters: 40, volumes: 4 },
            ),
        ).toEqual({ chapters: 120, volumes: 4 });
        expect(completedReadFill(undefined, undefined)).toEqual({});
    });
});

describe('list dates', () => {
    it('round-trips a calendar day through UTC midnight', () => {
        const unix = Date.UTC(2026, 9, 20) / 1000;
        const local = unixToLocalDate(unix);
        expect([
            local.getFullYear(),
            local.getMonth(),
            local.getDate(),
        ]).toEqual([2026, 9, 20]);
        expect(localDateToUnix(local)).toBe(unix);
    });

    it('stores the picked local day, not the local midnight instant', () => {
        expect(localDateToUnix(new Date(2026, 0, 1, 23, 30))).toBe(
            Date.UTC(2026, 0, 1) / 1000,
        );
    });
});
