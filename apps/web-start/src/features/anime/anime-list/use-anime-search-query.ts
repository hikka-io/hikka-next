'use client';

import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    SeasonEnum,
} from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import type { AnimeSearch } from '@/utils/search-schemas';
import { getSeasonByOffset } from '@/utils/season';

/**
 * Pure function: converts URL search params into the args shape expected
 * by the Hikka anime search API. Unit-testable, reusable for SSR prefetch.
 */
export function buildAnimeSearchArgs(search: AnimeSearch) {
    const media_type = (search.types ?? []) as AnimeMediaEnum[];
    const status = (search.statuses ?? []) as AnimeStatusEnum[];
    const season = (search.seasons ?? []) as SeasonEnum[];
    const rating = (search.ratings ?? []) as AnimeAgeRatingEnum[];
    const years = search.years ?? [];
    const genres = search.genres ?? [];
    const studios = search.studios ?? [];
    const date_range = (search.date_range ?? []) as [number, number];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;
    const sort = search.sort?.length ? search.sort : ['score'];
    const order = search.order || 'desc';

    const IMPLICIT_SECONDARY_SORTS: Record<string, string> = {
        score: 'scored_by',
        native_score: 'native_scored_by',
    };

    const expandedSort = sort.flatMap((field) => {
        const secondary = IMPLICIT_SECONDARY_SORTS[field];
        return secondary && !sort.includes(secondary)
            ? [field, secondary]
            : [field];
    });

    const convertedYears =
        date_range && date_range.length === 2
            ? [
                  getSeasonByOffset(date_range[0]),
                  getSeasonByOffset(date_range[1]),
              ]
            : years;

    return {
        args: {
            query: search.search || undefined,
            media_type,
            status,
            season,
            rating,
            years: convertedYears,
            genres,
            studios,
            score,
            only_translated: Boolean(only_translated),
            sort: expandedSort
                ? expandedSort.map((item) => `${item}:${order}`)
                : undefined,
        },
        page: search.page || 1,
    };
}

/**
 * Shared query for the /anime catalog. Both AnimeList and AnimeListSummary
 * call this with the same URL-derived args so the TanStack Query cache is
 * reused — no duplicate network requests.
 */
export function useAnimeSearchQuery(size?: number) {
    const search = useFilterSearch<AnimeSearch>();
    const { args, page } = buildAnimeSearchArgs(search);
    const paginationArgs = { page, size };

    const queryResult = useSearchAnimes({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    return { ...queryResult, args, paginationArgs, search };
}
