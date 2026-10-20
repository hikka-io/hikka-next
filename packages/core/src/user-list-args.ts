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

// No status and `all` both list every entry: the field is left out.
function listStatus(search: UserlistSearch) {
    return search.status && search.status !== USER_LIST_ALL_STATUS
        ? search.status
        : undefined;
}

function listScore(search: UserlistSearch) {
    return search.score?.length
        ? (search.score as [number, number])
        : undefined;
}

// Left out when off, so an unfiltered list keeps one key.
function onlyTranslated(search: UserlistSearch) {
    return search.only_translated ? { only_translated: true } : {};
}

/** Request body of a user's anime list (`POST /watch/{username}/list`). */
export function buildUserWatchListArgs(
    search: UserlistSearch,
): AnimeWatchSearchArgs {
    return {
        watch_status: listStatus(search) as WatchStatusEnum | undefined,
        media_type: (search.types ?? []) as AnimeMediaEnum[],
        status: (search.statuses ?? []) as AnimeStatusEnum[],
        season: (search.seasons ?? []) as SeasonEnum[],
        rating: (search.ratings ?? []) as AnimeAgeRatingEnum[],
        years: listYears(search),
        genres: search.genres ?? [],
        studios: search.studios ?? [],
        score: listScore(search),
        ...onlyTranslated(search),
        sort: expandSort('watch', search.sort, search.order),
    };
}

/** Request body of a user's manga or novel list (`POST /read/{content_type}/{username}/list`). */
export function buildUserReadListArgs(search: UserlistSearch): ReadSearchArgs {
    return {
        read_status: listStatus(search) as ReadStatusEnum | undefined,
        media_type: (search.types ?? []) as (MangaMediaEnum | NovelMediaEnum)[],
        status: (search.statuses ?? []) as ContentStatusEnum[],
        years: listYears(search),
        genres: search.genres ?? [],
        magazines: search.magazines ?? [],
        score: listScore(search),
        ...onlyTranslated(search),
        sort: expandSort('read', search.sort, search.order),
    };
}

/**
 * The status a "random title" request is sent for: the open status, or, for the whole list
 * (which the random endpoints do not accept), one status picked in proportion to its entries.
 */
export function randomListStatus<S extends string>(
    status: string,
    counts: Partial<Record<S, number>>,
    statuses: readonly S[],
    random: () => number = Math.random,
): S | undefined {
    if (status !== USER_LIST_ALL_STATUS) return status as S;

    const total = statuses.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
    if (total === 0) return undefined;

    let ticket = random() * total;
    let picked: S | undefined;
    for (const key of statuses) {
        const count = counts[key] ?? 0;
        if (count === 0) continue;

        picked = key;
        ticket -= count;
        if (ticket < 0) break;
    }

    return picked;
}
