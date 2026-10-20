import type {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    AnimeWatchSearchArgs,
    ContentStatusEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadSearchArgs,
    ReadStatusEnum,
    SeasonEnum,
    WatchStatusEnum,
} from '@hikka/api';

import type { UserlistSearch } from './search-schemas';
import { expandSort } from './sort';

/** `status` value that lists every entry: no status in the request body. */
export const USER_LIST_ALL_STATUS = 'all';

/** The status a list opens on when the URL names none, as on the web. */
export const DEFAULT_USER_LIST_STATUS = 'completed';

function listYears(search: UserlistSearch) {
    return (search.years ?? []) as [number | null, number | null];
}

function listScore(search: UserlistSearch) {
    return search.score?.length
        ? (search.score as [number, number])
        : undefined;
}

/** Request body of a user's anime list (`POST /watch/{username}/list`); callers always pass a status. */
export function buildUserWatchListArgs(
    search: UserlistSearch,
): AnimeWatchSearchArgs {
    return {
        watch_status:
            search.status !== USER_LIST_ALL_STATUS
                ? (String(search.status) as WatchStatusEnum)
                : undefined,
        media_type: (search.types ?? []) as AnimeMediaEnum[],
        status: (search.statuses ?? []) as AnimeStatusEnum[],
        season: (search.seasons ?? []) as SeasonEnum[],
        rating: (search.ratings ?? []) as AnimeAgeRatingEnum[],
        years: listYears(search),
        genres: search.genres ?? [],
        studios: search.studios ?? [],
        score: listScore(search),
        sort: expandSort('watch', search.sort, search.order),
    };
}

/** Request body of a user's manga or novel list (`POST /read/{content_type}/{username}/list`). */
export function buildUserReadListArgs(search: UserlistSearch): ReadSearchArgs {
    return {
        read_status:
            search.status !== USER_LIST_ALL_STATUS
                ? (search.status as ReadStatusEnum)
                : undefined,
        media_type: (search.types ?? []) as (MangaMediaEnum | NovelMediaEnum)[],
        status: (search.statuses ?? []) as ContentStatusEnum[],
        years: listYears(search),
        genres: search.genres ?? [],
        magazines: search.magazines ?? [],
        score: listScore(search),
        sort: expandSort('read', search.sort, search.order),
    };
}
