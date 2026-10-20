import type { AnimeStatusEnum, SeasonEnum } from '@hikka/api';
import {
    DEFAULT_SCHEDULE_STATUS,
    getCurrentSeason,
    getScheduleYears,
    RELEASE_STATUS,
    type ScheduleSearch,
    SEASON,
} from '@hikka/core';

/** The schedule filters with every value resolved, so the menu shows what is applied. */
export type ScheduleFilters = {
    season: SeasonEnum;
    year: number;
    status: AnimeStatusEnum[];
    onlyWatch: boolean;
};

export const defaultScheduleFilters = (): ScheduleFilters => ({
    season: getCurrentSeason() as SeasonEnum,
    year: getScheduleYears()[0],
    status: [...DEFAULT_SCHEDULE_STATUS],
    onlyWatch: false,
});

export const toScheduleSearch = (filters: ScheduleFilters): ScheduleSearch => ({
    season: filters.season,
    year: String(filters.year),
    status: filters.status,
    only_watch: filters.onlyWatch || undefined,
});

const sameStatuses = (a: AnimeStatusEnum[], b: AnimeStatusEnum[]) =>
    a.length === b.length && a.every((status) => b.includes(status));

export const hasActiveScheduleFilters = (filters: ScheduleFilters) => {
    const defaults = defaultScheduleFilters();

    return (
        filters.season !== defaults.season ||
        filters.year !== defaults.year ||
        filters.onlyWatch ||
        !sameStatuses(filters.status, defaults.status)
    );
};

/** A status can be toggled off only while another stays on; the last one falls back to the defaults, like the web. */
export const toggleScheduleStatus = (
    filters: ScheduleFilters,
    status: AnimeStatusEnum,
): ScheduleFilters => {
    const next = filters.status.includes(status)
        ? filters.status.filter((item) => item !== status)
        : [...filters.status, status];

    return {
        ...filters,
        status: next.length > 0 ? next : [...DEFAULT_SCHEDULE_STATUS],
    };
};

export const scheduleSummary = (filters: ScheduleFilters) =>
    [
        `${SEASON[filters.season].title_ua} ${filters.year}`,
        filters.status
            .map((status) => RELEASE_STATUS[status].title_ua)
            .join(', '),
        filters.onlyWatch ? 'У списку' : null,
    ]
        .filter(Boolean)
        .join(' · ');

export const SCHEDULE_STATUSES = Object.keys(
    RELEASE_STATUS,
) as AnimeStatusEnum[];

export const SCHEDULE_SEASONS = Object.keys(SEASON) as SeasonEnum[];
