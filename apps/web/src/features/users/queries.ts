import type {
    InfiniteData,
    UseInfiniteQueryOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import {
    type Client,
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    followersListInfiniteOptions,
    followingListInfiniteOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    type MainContentTypeEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
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
} from '@hikka/api';
import type { UserlistSearch } from '@hikka/core';
import {
    buildUserReadListArgs,
    buildUserWatchListArgs,
    userArticlesListArgs,
    userCollectionsListArgs,
} from '@hikka/core';

const HISTORY_PREVIEW_SIZE = 3;
const ARTICLES_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const FAVOURITES_PREVIEW_SIZE = 6;
// Backend page size of the lists below that send no `size`; skeletons render this many.
export const DEFAULT_PAGE_SIZE = 15;

function userWatchListOptions(
    username: string,
    search: UserlistSearch,
    client?: Client,
) {
    return {
        ...userWatchListInfiniteOptions({
            path: { username },
            body: buildUserWatchListArgs(search),
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
            body: buildUserReadListArgs(search),
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
            body: userArticlesListArgs(username),
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
            body: userCollectionsListArgs(username),
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
