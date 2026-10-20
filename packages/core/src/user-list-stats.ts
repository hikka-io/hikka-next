import { ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

import { DAY_FORMS, getDeclensionWord, MONTH_FORMS } from './i18n';

export const WATCH_STATUS_ORDER: WatchStatusEnum[] = [
    WatchStatusEnum.COMPLETED,
    WatchStatusEnum.WATCHING,
    WatchStatusEnum.PLANNED,
    WatchStatusEnum.DROPPED,
    WatchStatusEnum.ON_HOLD,
];

export const READ_STATUS_ORDER: ReadStatusEnum[] = [
    ReadStatusEnum.COMPLETED,
    ReadStatusEnum.READING,
    ReadStatusEnum.PLANNED,
    ReadStatusEnum.DROPPED,
    ReadStatusEnum.ON_HOLD,
];

const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30;

/** Splits a watch duration in minutes into rounded hours and a "N months N days" label. */
export function getWatchTime(durationMinutes: number): {
    hours: number;
    label: string;
} {
    const hours = Math.round((durationMinutes || 0) / 60);
    const totalDays = Math.floor(hours / HOURS_PER_DAY);
    const months = Math.floor(totalDays / DAYS_PER_MONTH);
    const days = totalDays % DAYS_PER_MONTH;

    const label = [
        months > 0 && `${months} ${getDeclensionWord(months, MONTH_FORMS)}`,
        (days > 0 || months === 0) &&
            `${days} ${getDeclensionWord(days, DAY_FORMS)}`,
    ]
        .filter(Boolean)
        .join(' ');

    return { hours, label };
}
