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
 * Shared query for the /anime catalog. Both AnimeList and AnimeListNavbar
 * call this with the same URL-derived args so the TanStack Query cache is
 * reused — no duplicate network requests.
 */
export function useAnimeSearchQuery() {
    const search = useFilterSearch<AnimeSearch>();

    const query = search.search;
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
    const page = search.page || 1;

    const convertYears = () => {
        if (date_range && date_range.length === 2) {
            return [
                getSeasonByOffset(date_range[0]),
                getSeasonByOffset(date_range[1]),
            ];
        }

        return years;
    };

    const args = {
        query: query || undefined,
        media_type,
        status,
        season,
        rating,
        years: convertYears(),
        genres,
        studios,
        score,
        only_translated: Boolean(only_translated),
        sort: sort ? sort.map((item) => `${item}:${order}`) : undefined,
    };

    const paginationArgs = { page };

    const queryResult = useSearchAnimes({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    return { ...queryResult, args, paginationArgs, search };
}
