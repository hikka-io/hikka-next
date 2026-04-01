import {
    FormatDistanceToken,
    formatDuration,
    intervalToDuration,
} from 'date-fns';

/**
 * Subset of formatting tokens used in this utility
 */
type Tokens = 'xSeconds' | 'xMinutes' | 'xHours' | 'xDays' | 'xMonths';

/**
 * Ukrainian localization for date-fns distance formatting
 */
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

/**
 * Time constants in seconds for duration calculations
 */
const TIME_CONSTANTS = {
    YEAR: 31536000, // 365 days
    MONTH: 2592000, // 30 days
    DAY: 86400, // 24 hours
};

/**
 * Creates a locale configuration for date-fns formatDistance with Ukrainian translations
 *
 * @returns A locale object for use in date-fns formatting functions
 */
export const getShortLocale = () => ({
    formatDistance: (token: FormatDistanceToken, count: number) => {
        return UKRAINIAN_FORMAT_DISTANCE_LOCALE[token].replace(
            '{{count}}',
            String(count),
        );
    },
});

/**
 * Determines appropriate format units based on the time left
 *
 * @param timeLeft - Time left in seconds
 * @returns Array of duration units to display
 */
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
 * Formats the duration between now and a target date in a human-readable format
 *
 * @param unixTimestamp - Unix timestamp in seconds (not milliseconds)
 * @param timeLeft - Optional time remaining in seconds to determine format units
 * @returns Formatted duration string in Ukrainian
 */
export const getScheduleDuration = (
    unixTimestamp: number,
    timeLeft?: number,
): string => {
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
