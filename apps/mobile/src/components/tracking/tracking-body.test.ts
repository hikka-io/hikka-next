import { describe, expect, it } from 'vitest';

import type { ReadResponseBase, WatchResponseBase } from '@hikka/api';

import {
    buildEditBody,
    buildStatusBody,
    clampInt,
    draftFromEntry,
    episodesMax,
    localDateToUnix,
    unixToLocalDate,
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
});
