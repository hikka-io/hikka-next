import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type Client,
    type CollectionsListArgs,
    type ContentStatusEnum,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    type MangaMediaEnum,
    type NovelMediaEnum,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import type { UserlistSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

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
    return userWatchListInfiniteOptions({
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
    });
}

export function userReadListOptions(
    username: string,
    contentType: ReadContentTypeEnum,
    search: UserlistSearch,
    client?: Client,
) {
    return userReadListInfiniteOptions({
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
    });
}

export function userArticlesPreviewOptions(username: string, client?: Client) {
    return getArticlesInfiniteOptions({
        body: { author: username },
        query: { size: 3 },
        client,
    });
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
    return getCollectionsInfiniteOptions({
        body: userCollectionsPreviewBody(username),
        client,
    });
}
