import { describe, expect, it } from 'vitest';

import {
    formatScheduleDay,
    getScheduleYears,
    groupScheduleByDay,
    SCHEDULE_FIRST_YEAR,
} from './schedule';

const at = (iso: string) => ({ airing_at: new Date(iso).getTime() / 1000 });

describe('groupScheduleByDay', () => {
    it('groups by local day and orders the days', () => {
        const late = at('2026-09-29T23:30:00');
        const early = at('2026-09-29T01:00:00');
        const next = at('2026-09-30T08:00:00');
        const previous = at('2026-09-28T12:00:00');

        const days = groupScheduleByDay([next, late, early, previous]);

        expect(days.map((day) => day.items)).toEqual([
            [previous],
            [late, early],
            [next],
        ]);
    });

    it('returns nothing for an empty list', () => {
        expect(groupScheduleByDay([])).toEqual([]);
    });
});

describe('formatScheduleDay', () => {
    it('names the weekday and date in Ukrainian', () => {
        const [day] = groupScheduleByDay([at('2026-09-29T12:00:00')]);

        expect(formatScheduleDay(day.day)).toEqual({
            weekday: 'Вівторок',
            date: '29 вересня',
        });
    });
});

describe('getScheduleYears', () => {
    it('lists the years from the current one back to the first', () => {
        expect(getScheduleYears(2026)).toEqual([2026, 2025, 2024, 2023]);
        expect(getScheduleYears(SCHEDULE_FIRST_YEAR)).toEqual([
            SCHEDULE_FIRST_YEAR,
        ]);
    });
});
