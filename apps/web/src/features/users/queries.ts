import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type Client,
    type CollectionsListArgs,
    type ContentStatusEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    type MangaMediaEnum,
    type NovelMediaEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    userHistoryInfiniteOptions,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import type { UserlistSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

const HISTORY_PREVIEW_SIZE = 3;
const ARTICLES_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const FAVORITE_PREVIEW_SIZE = 6;

function listYears(search: UserlistSearch) {
    return (search.years ?? []) as [number | null, number | null];
}

function listScore(search: UserlistSearch) {
    return search.score?.length
        ? (search.score as [number, number])
        : undefined;
}

export function userWatchListOptions(
    username: string,
    search: UserlistSearch,
    client?: Client,
) {
    return {
        ...userWatchListInfiniteOptions({
            path: { username },
            body: {
                watch_status:
                    search.status !== 'all'
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
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userReadListOptions(
    username: string,
    contentType: ReadContentTypeEnum,
    search: UserlistSearch,
    client?: Client,
) {
    return {
        ...userReadListInfiniteOptions({
            path: { username, content_type: contentType },
            body: {
                read_status:
                    search.status !== 'all'
                        ? (search.status as ReadStatusEnum)
                        : undefined,
                // ReadSearchArgs.media_type is typed MangaMediaEnum[]; novel media values are valid at runtime.
                media_type: (search.types ?? []) as (
                    | NovelMediaEnum
                    | MangaMediaEnum
                )[] as MangaMediaEnum[],
                status: (search.statuses ?? []) as ContentStatusEnum[],
                years: listYears(search),
                genres: search.genres ?? [],
                magazines: search.magazines ?? [],
                score: listScore(search),
                sort: expandSort('read', search.sort, search.order),
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userArticlesPreviewOptions(username: string, client?: Client) {
    return {
        ...getArticlesInfiniteOptions({
            body: { author: username },
            query: { size: ARTICLES_PREVIEW_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userCollectionsPreviewBody(
    username: string,
): CollectionsListArgs {
    return {
        author: username,
        sort: ['created:desc'],
        only_public: false,
    };
}

export function userCollectionsPreviewOptions(
    username: string,
    client?: Client,
) {
    return {
        ...getCollectionsInfiniteOptions({
            body: userCollectionsPreviewBody(username),
            query: { size: COLLECTIONS_PREVIEW_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userHistoryPreviewOptions(username: string, client?: Client) {
    return {
        ...userHistoryInfiniteOptions({
            path: { username },
            query: { size: HISTORY_PREVIEW_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userFavouritesPreviewOptions(
    username: string,
    contentType: FavouriteContentTypeEnum,
    client?: Client,
) {
    return {
        ...favouriteListInfiniteOptions({
            path: { username, content_type: contentType },
            query: { size: FAVORITE_PREVIEW_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function userFavouritesListOptions(
    username: string,
    contentType: FavouriteContentTypeEnum,
    client?: Client,
) {
    return {
        ...favouriteListInfiniteOptions({
            path: { username, content_type: contentType },
            client,
        }),
        ...paginationPageParam(),
    };
}
