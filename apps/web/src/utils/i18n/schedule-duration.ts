import {
    type FormatDistanceToken,
    formatDuration,
    intervalToDuration,
} from 'date-fns';

type Tokens = 'xSeconds' | 'xMinutes' | 'xHours' | 'xDays' | 'xMonths';

/** Ukrainian localization for date-fns distance formatting. */
const UKRAINIAN_FORMAT_DISTANCE_LOCALE = {
    xMonths: '{{count}} міс.',
    xWeeks: '{{count}} тиж.',
    xDays: '{{count}} дн.',
    xSeconds: '{{count}} сек.',
    xMinutes: '{{count}} хв.',
    xHours: '{{count}} год.',
    xYears: '{{count}} років',
    lessThanXSeconds: 'менше {{count}} сек.',
    lessThanXMinutes: 'менше {{count}} хв.',
    aboutXHours: 'близько {{count}} год.',
    aboutXWeeks: 'близько {{count}} тиж.',
    aboutXMonths: 'близько {{count}} міс.',
    aboutXYears: 'близько {{count}} років',
    halfAMinute: 'півхвилини',
    overXYears: 'більше {{count}} років',
    almostXYears: 'майже {{count}} років',
};

/** Durations in seconds. */
const TIME_CONSTANTS = {
    YEAR: 31536000, // 365 days
    MONTH: 2592000, // 30 days
    DAY: 86400, // 24 hours
};

/** date-fns formatDistance locale config with Ukrainian translations. */
export const getShortLocale = () => ({
    formatDistance: (token: FormatDistanceToken, count: number) => {
        return UKRAINIAN_FORMAT_DISTANCE_LOCALE[token].replace(
            '{{count}}',
            String(count),
        );
    },
});

/** Picks duration units to display based on time left (in seconds). */
export const getFormatUnits = (
    timeLeft: number,
): ('years' | 'months' | 'days' | 'hours' | 'minutes')[] => {
    if (timeLeft > TIME_CONSTANTS.YEAR) {
        return ['years', 'months'];
    } else if (timeLeft > TIME_CONSTANTS.MONTH) {
        return ['months', 'days'];
    } else if (timeLeft > TIME_CONSTANTS.DAY) {
        return ['days', 'hours'];
    } else {
        return ['hours', 'minutes'];
    }
};

/**
 * Formats the duration from now to a target date in Ukrainian.
 * @param unixTimestamp - Unix timestamp in seconds (not milliseconds)
 * @param timeLeft - Optional seconds remaining, used to pick format units
 */
export const getScheduleDuration = (
    unixTimestamp: number,
    timeLeft?: number,
): string => {
    if (timeLeft !== undefined && timeLeft <= 0) {
        return 'Вийшло';
    }

    const targetDateMs = unixTimestamp * 1000;
    const now = Date.now();

    return formatDuration(
        intervalToDuration({
            start: now,
            end: targetDateMs,
        }),
        {
            format: timeLeft ? getFormatUnits(timeLeft) : undefined,
            locale: getShortLocale(),
        },
    );
};
