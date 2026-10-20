import { describe, expect, it } from 'vitest';

import type { ReadResponseBase, WatchResponseBase } from '@hikka/api';

import {
    buildEditBody,
    buildStatusBody,
    clampInt,
    draftFromEntry,
    episodesMax,
    resolveListEntry,
} from './tracking-body';

const WATCH: WatchResponseBase = {
    reference: 'w1',
    note: 'rewatch the finale',
    updated: 0,
    created: 0,
    status: 'watching',
    rewatches: 1,
    duration: 0,
    episodes: 7,
    score: 9,
    start_date: 1_760_000_000,
    end_date: null,
};

const READ: ReadResponseBase = {
    reference: 'r1',
    note: null,
    updated: 0,
    created: 0,
    status: 'reading',
    chapters: 40,
    volumes: 4,
    rereads: 0,
    score: 0,
    start_date: null,
    end_date: 1_760_000_000,
};

describe('buildStatusBody', () => {
    it('carries every watch field over on a status change', () => {
        expect(buildStatusBody('watch', 'on_hold', WATCH, undefined)).toEqual({
            status: 'on_hold',
            episodes: 7,
            score: 9,
            note: 'rewatch the finale',
            rewatches: 1,
            start_date: 1_760_000_000,
            end_date: null,
        });
    });

    it('fills episodes from the total on completed', () => {
        expect(
            buildStatusBody('watch', 'completed', WATCH, {
                episodes_total: 28,
            }),
        ).toHaveProperty('episodes', 28);
    });

    it('keeps the carried progress when the total is unknown', () => {
        const body = buildStatusBody('watch', 'completed', WATCH, {
            episodes_total: null,
        });
        expect(body).toHaveProperty('episodes', 7);
    });

    it('fills chapters and volumes on completed, falling back to the entry', () => {
        expect(
            buildStatusBody('read', 'completed', READ, {
                chapters: 120,
                volumes: null,
            }),
        ).toMatchObject({ status: 'completed', chapters: 120, volumes: 4 });
    });

    it('sends only the status for an untracked title', () => {
        expect(
            buildStatusBody('read', 'planned', undefined, undefined),
        ).toEqual({ status: 'planned' });
    });
});

describe('buildEditBody', () => {
    it('sends the whole watch snapshot', () => {
        const body = buildEditBody('watch', draftFromEntry('watch', WATCH));
        expect(body).toEqual({
            status: 'watching',
            score: 9,
            episodes: 7,
            rewatches: 1,
            note: 'rewatch the finale',
            start_date: 1_760_000_000,
            end_date: null,
        });
    });

    it('sends the whole read snapshot, empty note as null', () => {
        const body = buildEditBody('read', draftFromEntry('read', READ));
        expect(body).toEqual({
            status: 'reading',
            score: 0,
            chapters: 40,
            volumes: 4,
            rereads: 0,
            note: null,
            start_date: null,
            end_date: 1_760_000_000,
        });
    });

    it('starts an untracked draft as planned with zeros', () => {
        expect(draftFromEntry('watch', null)).toMatchObject({
            status: 'planned',
            episodes: 0,
            score: 0,
            note: '',
            start_date: null,
        });
    });

    it('trims the note', () => {
        const draft = { ...draftFromEntry('watch', WATCH), note: '  hi  ' };
        expect(buildEditBody('watch', draft).note).toBe('hi');
    });
});

describe('bounds and dates', () => {
    it('caps anime episodes at a known total only', () => {
        expect(episodesMax({ episodes_total: 12 })).toBe(12);
        expect(episodesMax({ episodes_total: null })).toBe(10000);
        expect(episodesMax(undefined)).toBe(10000);
    });

    it('clamps to integers within bounds', () => {
        expect(clampInt(11, 0, 10)).toBe(10);
        expect(clampInt(-3, 0, 10)).toBe(0);
        expect(clampInt(4.7, 0, 10)).toBe(4);
        expect(clampInt(Number.NaN, 0, 10)).toBe(0);
    });
});

describe('resolveListEntry', () => {
    const verify = { cachedVerified: false, isError: false };

    it('never lets a stale cached null turn an embedded entry into "add"', () => {
        // Untracked title opened (cache null), then added elsewhere; a refetched list embeds it.
        expect(
            resolveListEntry({ supplied: WATCH, cached: null, ...verify }),
        ).toEqual({ state: 'verify' });
    });

    it('re-reads a stale cached entry the list says is gone the same way', () => {
        expect(
            resolveListEntry({ supplied: null, cached: WATCH, ...verify }),
        ).toEqual({ state: 'verify' });
    });

    it('trusts the re-read entry once it lands', () => {
        expect(
            resolveListEntry({
                supplied: WATCH,
                cached: null,
                cachedVerified: true,
                isError: false,
            }),
        ).toEqual({ state: 'resolved', entry: null });
    });

    it('turns a failed re-read into an error, not untracked', () => {
        expect(
            resolveListEntry({
                supplied: WATCH,
                cached: null,
                cachedVerified: false,
                isError: true,
            }),
        ).toEqual({ state: 'error' });
    });

    it('takes the supplied entry when nothing is cached', () => {
        expect(
            resolveListEntry({ supplied: WATCH, cached: undefined, ...verify }),
        ).toEqual({ state: 'resolved', entry: WATCH });
        expect(
            resolveListEntry({ supplied: null, cached: undefined, ...verify }),
        ).toEqual({ state: 'resolved', entry: null });
    });

    it('takes the newer of two entries', () => {
        const newer = { ...WATCH, updated: WATCH.updated + 10, score: 3 };
        expect(
            resolveListEntry({ supplied: newer, cached: WATCH, ...verify }),
        ).toEqual({ state: 'resolved', entry: newer });
        expect(
            resolveListEntry({ supplied: WATCH, cached: newer, ...verify }),
        ).toEqual({ state: 'resolved', entry: newer });
    });

    it('agrees on untracked', () => {
        expect(
            resolveListEntry({ supplied: null, cached: null, ...verify }),
        ).toEqual({ state: 'resolved', entry: null });
    });

    it('waits for or fails the read when nothing is supplied', () => {
        expect(
            resolveListEntry({
                supplied: undefined,
                cached: undefined,
                ...verify,
            }),
        ).toEqual({ state: 'loading' });
        expect(
            resolveListEntry({
                supplied: undefined,
                cached: undefined,
                cachedVerified: false,
                isError: true,
            }),
        ).toEqual({ state: 'error' });
        expect(
            resolveListEntry({ supplied: undefined, cached: null, ...verify }),
        ).toEqual({ state: 'resolved', entry: null });
    });
});
