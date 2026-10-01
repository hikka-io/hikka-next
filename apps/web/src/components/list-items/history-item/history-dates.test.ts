import { describe, expect, it } from 'vitest';

import { formatHistoryTime, groupHistoryByDay } from './history-dates';

const TIME_ZONE = 'Europe/Kyiv';
const NOW = Date.UTC(2026, 9, 1, 9);
const at = (...args: [number, number, number, number, number?]) => ({
    created: Date.UTC(...args) / 1000,
});

const summary = (items: { created: number }[], timeZone = TIME_ZONE) =>
    groupHistoryByDay(items, NOW, timeZone).map(
        ({ key, label, detail, items: dayItems }) => ({
            key,
            label,
            detail,
            count: dayItems.length,
        }),
    );

describe('groupHistoryByDay', () => {
    it('labels today, yesterday and older days', () => {
        expect(
            summary([
                at(2026, 9, 1, 8),
                at(2026, 9, 1, 6),
                at(2026, 8, 30, 5),
                at(2026, 7, 12, 2),
            ]),
        ).toEqual([
            {
                key: '2026-10-01',
                label: 'Сьогодні',
                detail: '1 жовтня',
                count: 2,
            },
            {
                key: '2026-09-30',
                label: 'Вчора',
                detail: '30 вересня',
                count: 1,
            },
            {
                key: '2026-08-12',
                label: '12 серпня',
                detail: 'середа',
                count: 1,
            },
        ]);
    });

    it('adds the year to days of another year', () => {
        expect(summary([at(2025, 4, 28, 12)])[0].label).toMatch(
            /^28 травня 2025/,
        );
    });

    it('groups by the local day, not the UTC day', () => {
        const lateUtc = at(2026, 8, 30, 22);

        expect(summary([lateUtc])[0].label).toBe('Сьогодні');
        expect(summary([lateUtc], 'UTC')[0].label).toBe('Вчора');
    });

    it('keeps one group per day across pages', () => {
        expect(
            summary([at(2026, 9, 1, 8), at(2026, 8, 30, 8), at(2026, 9, 1, 7)]),
        ).toEqual([
            {
                key: '2026-10-01',
                label: 'Сьогодні',
                detail: '1 жовтня',
                count: 2,
            },
            {
                key: '2026-09-30',
                label: 'Вчора',
                detail: '30 вересня',
                count: 1,
            },
        ]);
    });

    it('returns no groups for an empty list', () => {
        expect(groupHistoryByDay([], NOW, TIME_ZONE)).toEqual([]);
    });
});

describe('formatHistoryTime', () => {
    it('formats a 24-hour local time', () => {
        expect(
            formatHistoryTime(Date.UTC(2026, 9, 1, 5, 11) / 1000, TIME_ZONE),
        ).toBe('08:11');
        expect(
            formatHistoryTime(Date.UTC(2026, 9, 1, 21, 5) / 1000, TIME_ZONE),
        ).toBe('00:05');
    });
});
