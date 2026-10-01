import { format } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { type ActivityDay, buildActivityGrid } from './activity-grid';

const NOW = Date.parse('2026-10-02T12:00:00Z');

const utcMidnight = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 1000;

const calendar = (date: Date) => format(date, 'yyyy-MM-dd');

const daysOf = (grid: ReturnType<typeof buildActivityGrid>) =>
    grid.weeks.flat().filter(Boolean) as ActivityDay[];

const dayAt = (grid: ReturnType<typeof buildActivityGrid>, iso: string) =>
    daysOf(grid).find((day) => calendar(day.date) === iso);

describe('buildActivityGrid', () => {
    it('covers 365 days ending on the UTC date of now', () => {
        const days = daysOf(buildActivityGrid([], NOW));

        expect(days).toHaveLength(365);
        expect(calendar(days[0].date)).toBe('2025-10-03');
        expect(calendar(days[364].date)).toBe('2026-10-02');
    });

    it('starts weeks on Monday and pads days outside the window', () => {
        const { weeks } = buildActivityGrid([], NOW);

        expect(weeks[0].slice(0, 4)).toEqual([null, null, null, null]);
        expect(weeks[0][4]).not.toBeNull();
        expect(weeks.at(-1)?.slice(5)).toEqual([null, null]);
    });

    it('buckets actions by UTC date', () => {
        const grid = buildActivityGrid(
            [
                { timestamp: utcMidnight('2026-10-01'), actions: 2 },
                { timestamp: utcMidnight('2026-10-01') - 3600, actions: 5 },
            ],
            NOW,
        );

        expect(dayAt(grid, '2026-10-01')?.actions).toBe(2);
        expect(dayAt(grid, '2026-09-30')?.actions).toBe(5);
    });

    it('ignores empty days and days outside the window', () => {
        const grid = buildActivityGrid(
            [
                { timestamp: utcMidnight('2025-10-02'), actions: 9 },
                { timestamp: utcMidnight('2026-10-03'), actions: 9 },
                { timestamp: utcMidnight('2026-01-01'), actions: 0 },
                { timestamp: utcMidnight('2026-01-02'), actions: 3 },
                { timestamp: utcMidnight('2026-01-03'), actions: 4 },
            ],
            NOW,
        );

        expect(grid.total).toBe(7);
        expect(grid.activeDays).toBe(2);
    });

    it('spreads distinct counts across the four levels', () => {
        const grid = buildActivityGrid(
            [1, 2, 3, 4].map((actions, index) => ({
                timestamp: utcMidnight(`2026-09-0${index + 1}`),
                actions,
            })),
            NOW,
        );

        expect(
            ['01', '02', '03', '04'].map(
                (day) => dayAt(grid, `2026-09-${day}`)?.level,
            ),
        ).toEqual([1, 2, 3, 4]);
        expect(dayAt(grid, '2026-09-05')?.level).toBe(0);
    });

    it('puts a flat history mid-scale', () => {
        const grid = buildActivityGrid(
            ['2026-09-01', '2026-09-02', '2026-09-03'].map((iso) => ({
                timestamp: utcMidnight(iso),
                actions: 1,
            })),
            NOW,
        );

        expect(dayAt(grid, '2026-09-02')?.level).toBe(2);
    });
});
