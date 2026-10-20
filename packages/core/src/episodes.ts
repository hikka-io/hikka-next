import { format } from 'date-fns/format';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';

import { AnimeStatusEnum } from '@hikka/api';

import { APP_LOCALE } from './i18n/locale';

/** Episode length in minutes as words, e.g. `24 хвилини`. */
export const formatEpisodeDuration = (duration: number) =>
    formatDuration(
        intervalToDuration({ start: 0, end: duration * 60 * 1000 }),
        { locale: APP_LOCALE },
    );

/** `total` for a finished anime, `released / total` otherwise, `?` for unknowns. */
export const formatEpisodeCount = (
    status: string | null,
    episodesReleased: number | null,
    episodesTotal: number | null,
) => {
    if (status === AnimeStatusEnum.FINISHED) {
        return episodesTotal?.toString() ?? '?';
    }
    return `${episodesReleased ?? '?'} / ${episodesTotal ?? '?'}`;
};

/**
 * The first scheduled episode that has not aired yet. The API types schedule
 * items as open records, so a shape change degrades to "no next episode".
 */
export const findNextEpisode = (
    schedule: ReadonlyArray<{ [key: string]: unknown }>,
    now = Date.now(),
) =>
    (schedule as Array<{ airing_at?: unknown }>).find(
        (item): item is { airing_at: number } =>
            typeof item.airing_at === 'number' && item.airing_at * 1000 > now,
    );

export const formatNextEpisodeDate = (airingAt: number) =>
    format(new Date(airingAt * 1000), 'd MMMM HH:mm', { locale: APP_LOCALE });
