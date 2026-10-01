import { APP_LOCALE_TAG } from '@/utils/i18n/locale';

type Created = { created: number };

export type HistoryDay<T extends Created> = {
    key: string;
    label: string;
    detail: string;
    items: T[];
};

const FORMATS = {
    key: { year: 'numeric', month: '2-digit', day: '2-digit' },
    dayMonth: { day: 'numeric', month: 'long' },
    dayMonthYear: { day: 'numeric', month: 'long', year: 'numeric' },
    weekday: { weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

const formatters = new Map<string, Intl.DateTimeFormat>();

const formatter = (format: keyof typeof FORMATS, timeZone?: string) => {
    const cacheKey = `${format}:${timeZone ?? ''}`;
    let cached = formatters.get(cacheKey);

    if (!cached) {
        cached = new Intl.DateTimeFormat(APP_LOCALE_TAG, {
            ...FORMATS[format],
            timeZone,
        });
        formatters.set(cacheKey, cached);
    }

    return cached;
};

const dayKey = (ms: number, timeZone?: string) => {
    const parts = formatter('key', timeZone).formatToParts(ms);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((item) => item.type === type)?.value;

    return `${part('year')}-${part('month')}-${part('day')}`;
};

const previousDayKey = (key: string) => {
    const [year, month, day] = key.split('-').map(Number);

    return dayKey(Date.UTC(year, month - 1, day - 1), 'UTC');
};

export const formatHistoryDate = (seconds: number, timeZone?: string) =>
    formatter('dayMonth', timeZone).format(seconds * 1000);

export const formatHistoryTime = (seconds: number, timeZone?: string) =>
    formatter('time', timeZone).format(seconds * 1000);

export function groupHistoryByDay<T extends Created>(
    items: T[],
    nowMs: number,
    timeZone?: string,
): HistoryDay<T>[] {
    const today = dayKey(nowMs, timeZone);
    const yesterday = previousDayKey(today);
    const days = new Map<string, HistoryDay<T>>();

    for (const item of items) {
        const ms = item.created * 1000;
        const key = dayKey(ms, timeZone);
        const day = days.get(key);

        if (day) {
            day.items.push(item);
            continue;
        }

        const date = formatter('dayMonth', timeZone).format(ms);
        const relative =
            key === today ? 'Сьогодні' : key === yesterday ? 'Вчора' : null;
        const sameYear = key.slice(0, 4) === today.slice(0, 4);

        days.set(key, {
            key,
            label:
                relative ??
                (sameYear
                    ? date
                    : formatter('dayMonthYear', timeZone).format(ms)),
            detail: relative ? date : formatter('weekday', timeZone).format(ms),
            items: [item],
        });
    }

    return [...days.values()];
}
