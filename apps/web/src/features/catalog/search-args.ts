import type {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    ContentStatusEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    SeasonEnum,
} from '@hikka/api';

import type {
    AnimeSearch,
    MangaSearch,
    NovelSearch,
} from '@/utils/search-schemas';
import { getSeasonByOffset } from '@/utils/season';
import { expandSort } from '@/utils/sort';

/** Converts URL search params into the Hikka anime search API args shape. */
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
            sort: expandSort('anime', search.sort, search.order),
        },
        page: search.page || 1,
    };
}

/** Converts URL search params into the Hikka manga search API args shape. */
export function buildMangaSearchArgs(search: MangaSearch) {
    const media_type = (search.types ?? []) as MangaMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;

    return {
        args: {
            query: search.search || undefined,
            media_type,
            status,
            years,
            genres,
            score,
            only_translated: Boolean(only_translated),
            sort: expandSort('manga', search.sort, search.order),
        },
        page: search.page || 1,
    };
}

/** Converts URL search params into the Hikka novel search API args shape. */
export function buildNovelSearchArgs(search: NovelSearch) {
    const media_type = (search.types ?? []) as NovelMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;

    return {
        args: {
            query: search.search || undefined,
            media_type,
            status,
            years,
            genres,
            score,
            only_translated: Boolean(only_translated),
            sort: expandSort('novel', search.sort, search.order),
        },
        page: search.page || 1,
    };
}
