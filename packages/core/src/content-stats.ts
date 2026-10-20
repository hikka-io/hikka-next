import {
    type AnimeStatsResponse,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type AppCommonSchemasReadReadStatsResponse as ReadStatsResponse,
    type ReadStatusEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import { READ_STATUS_ORDER, WATCH_STATUS_ORDER } from './user-list-stats';

export type ContentStats = AnimeStatsResponse | ReadStatsResponse;

export type StatShare<K> = {
    key: K;
    count: number;
    /** Share of the group's total, 0-100. */
    percentage: number;
};

export const CONTENT_SCORES = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] as const;

export type ContentScore = (typeof CONTENT_SCORES)[number];

const countOf = (stats: ContentStats, key: string) =>
    (stats as Record<string, number | undefined>)[key] ?? 0;

const withShares = <K>(
    entries: { key: K; count: number }[],
): StatShare<K>[] => {
    const total = entries.reduce((sum, entry) => sum + entry.count, 0);

    return entries.map((entry) => ({
        ...entry,
        percentage: total > 0 ? (100 * entry.count) / total : 0,
    }));
};

/** How many users hold the title in each list status, in the profile's status order. */
export function contentStatusStats(
    stats: ContentStats,
    contentType: MainContentTypeEnum,
): StatShare<WatchStatusEnum | ReadStatusEnum>[] {
    const order: readonly (WatchStatusEnum | ReadStatusEnum)[] =
        contentType === ContentTypeEnum.ANIME
            ? WATCH_STATUS_ORDER
            : READ_STATUS_ORDER;

    return withShares(
        order.map((status) => ({
            key: status,
            count: countOf(stats, status),
        })),
    );
}

/** The score histogram from 10 down to 1; scores nobody gave are left out. */
export function contentScoreStats(
    stats: ContentStats,
): StatShare<ContentScore>[] {
    return withShares(
        CONTENT_SCORES.map((score) => ({
            key: score,
            count: countOf(stats, `score_${score}`),
        })),
    ).filter((entry) => entry.count > 0);
}
