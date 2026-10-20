import { format, getUnixTime, startOfDay } from 'date-fns';

import { APP_LOCALE } from './i18n/locale';

export const SCHEDULE_FIRST_YEAR = 2023;

/** The years the schedule filter offers, newest first. */
export const getScheduleYears = (currentYear = new Date().getFullYear()) =>
    Array.from(
        { length: currentYear + 1 - SCHEDULE_FIRST_YEAR },
        (_, index) => currentYear - index,
    );

export type ScheduleDay<T> = {
    /** Unix seconds at the start of the local day. */
    day: number;
    items: T[];
};

/** Group schedule entries by the local day they air on, earliest day first. */
export const groupScheduleByDay = <T extends { airing_at: number }>(
    items: readonly T[],
): ScheduleDay<T>[] => {
    const days = new Map<number, ScheduleDay<T>>();

    for (const item of items) {
        const day = getUnixTime(startOfDay(item.airing_at * 1000));
        const group = days.get(day);

        if (group) group.items.push(item);
        else days.set(day, { day, items: [item] });
    }

    return [...days.values()].sort((a, b) => a.day - b.day);
};

const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

/** "Понеділок" and "7 жовтня" for a day from `groupScheduleByDay`. */
export const formatScheduleDay = (day: number) => ({
    weekday: capitalize(format(day * 1000, 'eeee', { locale: APP_LOCALE })),
    date: format(day * 1000, 'd MMMM', { locale: APP_LOCALE }),
});
