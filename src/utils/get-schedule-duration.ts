import { FormatDistanceToken } from 'date-fns';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';

type Tokens = 'xSeconds' | 'xMinutes' | 'xHours' | 'xDays' | 'xMonths';

const formatDistanceLocale = {
    uk: {
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
    },
};

export const getShortLocale = () => ({
    formatDistance: (token: FormatDistanceToken, count: number) => {
        return formatDistanceLocale['uk'][token].replace(
            '{{count}}',
            String(count),
        );
    },
});

const getScheduleDuration = (date: number, timeLeft: number) => {
    return formatDuration(
        intervalToDuration({
            start: date * 1000,
            end: Date.now(),
        }),
        {
            format:
                timeLeft > 31536000
                    ? ['years', 'months']
                    : timeLeft > 2592000
                      ? ['months', 'days']
                      : timeLeft > 86400
                        ? ['days', 'hours']
                        : ['hours', 'minutes'],
            locale: getShortLocale(),
        },
    );
};

export default getScheduleDuration;
