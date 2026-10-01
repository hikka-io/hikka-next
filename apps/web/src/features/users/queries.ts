import type {
    InfiniteData,
    UseInfiniteQueryOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type Client,
    type ContentStatusEnum,
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    followersListInfiniteOptions,
    followingListInfiniteOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    type MainContentTypeEnum,
    type MangaMediaEnum,
    type NovelMediaEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    type UserReadListError,
    type UserReadListResponse,
    type UserReadStatsError,
    type UserReadStatsResponse,
    type UserWatchListError,
    type UserWatchListResponse,
    type UserWatchStatsError,
    type UserWatchStatsResponse,
    userHistoryInfiniteOptions,
    userReadListInfiniteOptions,
    userReadStatsOptions,
    userWatchListInfiniteOptions,
    userWatchStatsOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import type { UserlistSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

const HISTORY_PREVIEW_SIZE = 3;
const ARTICLES_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const FAVOURITES_PREVIEW_SIZE = 6;
// Backend page size of the lists below that send no `size`; skeletons render this many.
export const DEFAULT_PAGE_SIZE = 15;

function listYears(search: UserlistSearch) {
    return (search.years ?? []) as [number | null, number | null];
}

function listScore(search: UserlistSearch) {
    return search.score?.length
        ? (search.score as [number, number])
        : undefined;
}

function userWatchListOptions(
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

function userReadListOptions(
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

type UserListPage = UserWatchListResponse | UserReadListResponse;

type UserListOptions = UseInfiniteQueryOptions<
    UserListPage,
    UserWatchListError | UserReadListError,
    InfiniteData<UserListPage>,
    | ReturnType<typeof userWatchListOptions>['queryKey']
    | ReturnType<typeof userReadListOptions>['queryKey'],
    number
>;

export function userListOptions(
    username: string,
    contentType: MainContentTypeEnum,
    search: UserlistSearch,
    client?: Client,
): UserListOptions {
    const options =
        contentType === ContentTypeEnum.ANIME
            ? userWatchListOptions(username, search, client)
            : userReadListOptions(username, contentType, search, client);

    return options as unknown as UserListOptions;
}

type UserListStats = UserWatchStatsResponse | UserReadStatsResponse;

type UserListStatsOptions = UseQueryOptions<
    UserListStats,
    UserWatchStatsError | UserReadStatsError,
    UserListStats,
    | ReturnType<typeof userWatchStatsOptions>['queryKey']
    | ReturnType<typeof userReadStatsOptions>['queryKey']
>;

export function userListStatsOptions(
    username: string,
    contentType: MainContentTypeEnum,
    client?: Client,
): UserListStatsOptions {
    const options =
        contentType === ContentTypeEnum.ANIME
            ? userWatchStatsOptions({ path: { username }, client })
            : userReadStatsOptions({
                  path: { username, content_type: contentType },
                  client,
              });

    return options as unknown as UserListStatsOptions;
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

export function userCollectionsOptions(
    username: string,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
) {
    return {
        ...getCollectionsInfiniteOptions({
            body: {
                author: username,
                sort: ['created:desc'],
                only_public: false,
            },
            query: preview ? { size: COLLECTIONS_PREVIEW_SIZE } : undefined,
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

export function userFavouritesOptions(
    username: string,
    contentType: FavouriteContentTypeEnum,
    { preview = false }: { preview?: boolean } = {},
    client?: Client,
) {
    return {
        ...favouriteListInfiniteOptions({
            path: { username, content_type: contentType },
            query: preview ? { size: FAVOURITES_PREVIEW_SIZE } : undefined,
            client,
        }),
        ...paginationPageParam(),
    };
}

export type FollowListKind = 'followers' | 'followings';

const FOLLOW_LISTS = {
    followers: followersListInfiniteOptions,
    followings: followingListInfiniteOptions,
} satisfies Record<FollowListKind, unknown>;

export function followListOptions(
    kind: FollowListKind,
    username: string,
    client?: Client,
) {
    // Both endpoints return one page type, so one options type covers them.
    const build = FOLLOW_LISTS[kind] as typeof followersListInfiniteOptions;

    return {
        ...build({ path: { username }, client }),
        ...paginationPageParam(),
    };
}
