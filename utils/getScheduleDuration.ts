import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

type Tokens = 'xSeconds' | 'xMinutes' | 'xHours' | 'xDays' | 'xMonths';

const formatDistanceLocale = {
    uk: {
        xMonths: '{{count}} міс.',
        xDays: '{{count}} дн.',
        xSeconds: '{{count}} сек.',
        xMinutes: '{{count}} хв.',
        xHours: '{{count}} год.',
    },
};

export const getShortLocale = () => ({
    formatDistance: (token: Tokens, count: string) => {
        return formatDistanceLocale['uk'][token].replace('{{count}}', count);
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
                timeLeft > 2592000
                    ? ['months', 'days']
                    : timeLeft > 86400
                      ? ['days', 'hours']
                      : ['hours', 'minutes'],
            locale: getShortLocale(),
        },
    );
};

export default getScheduleDuration;
