import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    EVENT_THEMES,
    type EventTheme,
    getActiveEventTheme,
} from './event-themes';

const WINTER: EventTheme = {
    id: 'winter',
    name: 'Winter',
    effects: ['snowfall'],
    startDate: new Date('2030-12-05T00:00:00Z'),
    endDate: new Date('2031-01-15T00:00:00Z'),
};

const SPRING: EventTheme = {
    id: 'spring',
    name: 'Spring',
    effects: ['sakura'],
    startDate: new Date('2031-03-20T00:00:00Z'),
    endDate: new Date('2031-04-10T00:00:00Z'),
};

const at = (iso: string) => vi.setSystemTime(new Date(iso));

afterEach(() => {
    vi.useRealTimers();
});

describe('EVENT_THEMES', () => {
    it('ships no event theme', () => {
        expect(EVENT_THEMES).toEqual([]);
    });

    it('resolves no active theme from the shipped list', () => {
        vi.useFakeTimers();
        at('2024-12-25T12:00:00Z');

        expect(getActiveEventTheme()).toBeNull();
    });
});

describe('getActiveEventTheme', () => {
    it('returns the theme whose range contains now', () => {
        vi.useFakeTimers();
        at('2030-12-31T18:00:00Z');

        expect(getActiveEventTheme([SPRING, WINTER])).toBe(WINTER);
    });

    it.each([
        ['the start instant', '2030-12-05T00:00:00.000Z'],
        ['the end instant', '2031-01-15T00:00:00.000Z'],
    ])('includes %s', (_, iso) => {
        vi.useFakeTimers();
        at(iso);

        expect(getActiveEventTheme([WINTER])).toBe(WINTER);
    });

    it.each([
        ['just before the start', '2030-12-04T23:59:59.999Z'],
        ['just after the end', '2031-01-15T00:00:00.001Z'],
        ['between two themes', '2031-02-01T00:00:00.000Z'],
    ])('returns null %s', (_, iso) => {
        vi.useFakeTimers();
        at(iso);

        expect(getActiveEventTheme([WINTER, SPRING])).toBeNull();
    });

    it('returns null for an empty list', () => {
        vi.useFakeTimers();
        at('2030-12-31T18:00:00Z');

        expect(getActiveEventTheme([])).toBeNull();
    });

    it('prefers the first listed theme when ranges overlap', () => {
        vi.useFakeTimers();
        at('2030-12-31T18:00:00Z');
        const overlap = { ...SPRING, startDate: WINTER.startDate };

        expect(getActiveEventTheme([overlap, WINTER])).toBe(overlap);
    });
});
