import { format, isSameYear, type Locale } from 'date-fns';
import { uk } from 'date-fns/locale/uk';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type FormattedTimestamp = {
    /** Short label: compact relative for <24h, absolute date after. */
    label: string;
    /** Full localized timestamp for the native tooltip / <time> title. */
    full: string;
    /** ISO string for the <time datetime> attribute. */
    iso: string;
};

/**
 * - < 24h: compact relative ("2 год тому", "5 хв тому") via Intl.RelativeTimeFormat.
 * - same calendar year: absolute without year ("6 лип").
 * - earlier years: absolute with year ("6 лип 2024").
 *
 * @param unixSeconds - Unix timestamp in seconds (not milliseconds).
 * @param nowMs - Current time in ms; pass Date.now() at the call site.
 */
export const formatTimestamp = (
    unixSeconds: number,
    nowMs: number,
    locale: Locale = uk,
): FormattedTimestamp => {
    const ms = unixSeconds * 1000;
    const date = new Date(ms);
    const now = new Date(nowMs);
    const diffSeconds = Math.max(0, Math.floor((nowMs - ms) / 1000));

    const iso = date.toISOString();
    const full = format(ms, 'HH:mm · d MMMM yyyy', { locale });

    let label: string;
    if (diffSeconds < DAY) {
        const rtf = new Intl.RelativeTimeFormat(locale.code, {
            numeric: 'always',
            style: 'narrow',
        });
        if (diffSeconds < MINUTE) {
            label = rtf.format(-Math.max(1, diffSeconds), 'second');
        } else if (diffSeconds < HOUR) {
            label = rtf.format(-Math.floor(diffSeconds / MINUTE), 'minute');
        } else {
            label = rtf.format(-Math.floor(diffSeconds / HOUR), 'hour');
        }
    } else {
        label = isSameYear(date, now)
            ? format(ms, 'd MMM', { locale })
            : format(ms, 'd MMM yyyy', { locale });
    }

    return { label, full, iso };
};
