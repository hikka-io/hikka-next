import type { ActivityResponse } from '@hikka/api';

const DAY_MS = 86_400_000;
const DAYS_IN_YEAR = 365;
const DAYS_IN_WEEK = 7;
const LEVEL_COUNT = 4;

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export type ActivityDay = {
    date: Date;
    actions: number;
    level: ActivityLevel;
};

export type ActivityWeek = (ActivityDay | null)[];

export type ActivityGrid = {
    weeks: ActivityWeek[];
    total: number;
    activeDays: number;
};

// The backend buckets actions by UTC date and stamps each day at UTC midnight.
const toDayNumber = (ms: number) => Math.floor(ms / DAY_MS);

// Day 0 (1970-01-01) was a Thursday; weeks start on Monday.
const weekdayOf = (day: number) => (day + 3) % DAYS_IN_WEEK;

const toCalendarDate = (day: number) => {
    const utc = new Date(day * DAY_MS);

    return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
};

// Quartile of the mid-rank among active days, so ties share a level and a
// flat history lands mid-scale instead of at the faintest step.
const levelsByActions = (counts: number[]) => {
    const sorted = [...counts].sort((a, b) => a - b);
    const levels = new Map<number, ActivityLevel>();

    for (let start = 0; start < sorted.length; ) {
        let end = start;
        while (end < sorted.length && sorted[end] === sorted[start]) end++;

        const midRank = (start + end) / (2 * sorted.length);
        levels.set(
            sorted[start],
            Math.ceil(midRank * LEVEL_COUNT) as ActivityLevel,
        );
        start = end;
    }

    return levels;
};

export function buildActivityGrid(
    activity: ActivityResponse[] | undefined,
    now = Date.now(),
): ActivityGrid {
    const today = toDayNumber(now);
    const first = today - DAYS_IN_YEAR + 1;

    const actionsByDay = new Map<number, number>();
    for (const { timestamp, actions } of activity ?? []) {
        const day = toDayNumber(timestamp * 1000);
        if (actions <= 0 || day < first || day > today) continue;
        actionsByDay.set(day, (actionsByDay.get(day) ?? 0) + actions);
    }

    const counts = [...actionsByDay.values()];
    const levels = levelsByActions(counts);

    const weeks: ActivityWeek[] = [];
    for (
        let weekStart = first - weekdayOf(first);
        weekStart <= today;
        weekStart += DAYS_IN_WEEK
    ) {
        const week = Array.from({ length: DAYS_IN_WEEK }, (_, weekday) => {
            const day = weekStart + weekday;
            if (day < first || day > today) return null;

            const actions = actionsByDay.get(day) ?? 0;
            return {
                date: toCalendarDate(day),
                actions,
                level: levels.get(actions) ?? 0,
            };
        });

        weeks.push(week);
    }

    return {
        weeks,
        total: counts.reduce((sum, actions) => sum + actions, 0),
        activeDays: actionsByDay.size,
    };
}
