import type {
    InfiniteData,
    UseInfiniteQueryOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import {
    ContentTypeEnum,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    followersListInfiniteOptions,
    followingHistoryInfiniteOptions,
    followingListInfiniteOptions,
    followStatsOptions,
    type MainContentTypeEnum,
    paginationPageParam,
    type ReadResponse,
    serviceUserActivityOptions,
    serviceUserStatsOptions,
    type UserReadStatsResponse,
    type UserWatchStatsResponse,
    userHistoryInfiniteOptions,
    userProfileOptions,
    userReadListInfiniteOptions,
    userReadStatsOptions,
    userReferenceOptions,
    userWatchListInfiniteOptions,
    userWatchStatsOptions,
    type WatchResponse,
} from '@hikka/api';
import {
    buildUserReadListArgs,
    buildUserWatchListArgs,
    type UserlistSearch,
} from '@hikka/core';

export const FAVOURITES_PAGE_SIZE = 12;
export const HISTORY_PREVIEW_SIZE = 3;
// Backend page size of the lists below that send no `size` (same keys as the web); skeletons render this many.
export const DEFAULT_PAGE_SIZE = 15;

export type ListContentType = MainContentTypeEnum;

export type UserListEntry = WatchResponse | ReadResponse;

export type UserListStats = UserWatchStatsResponse | UserReadStatsResponse;

export {
    followStatsOptions,
    serviceUserActivityOptions,
    serviceUserStatsOptions,
    userProfileOptions,
    userReferenceOptions,
};

type UserListStatsOptions = UseQueryOptions<
    UserListStats,
    Error,
    UserListStats,
    readonly unknown[]
>;

/** Status counts of one list; anime and the read lists come from two endpoints. */
export function userListStatsOptions(
    username: string,
    contentType: ListContentType,
): UserListStatsOptions {
    const options =
        contentType === ContentTypeEnum.ANIME
            ? userWatchStatsOptions({ path: { username } })
            : userReadStatsOptions({
                  path: { username, content_type: contentType },
              });

    return options as unknown as UserListStatsOptions;
}

type UserListPage = { list: UserListEntry[] };

type UserListOptions = UseInfiniteQueryOptions<
    UserListPage,
    Error,
    InfiniteData<UserListPage>,
    readonly unknown[],
    number
>;

/** One page of a user's list; the body is built in `@hikka/core`, so the web shares the key. */
export function userListOptions(
    username: string,
    contentType: ListContentType,
    search: UserlistSearch,
): UserListOptions {
    const options =
        contentType === ContentTypeEnum.ANIME
            ? userWatchListInfiniteOptions({
                  path: { username },
                  body: buildUserWatchListArgs(search),
              })
            : userReadListInfiniteOptions({
                  path: { username, content_type: contentType },
                  body: buildUserReadListArgs(search),
              });

    return {
        ...options,
        ...paginationPageParam(),
    } as unknown as UserListOptions;
}

export const userFavouritesOptions = (
    username: string,
    contentType: FavouriteContentTypeEnum,
) => ({
    ...favouriteListInfiniteOptions({
        path: { username, content_type: contentType },
        query: { size: FAVOURITES_PAGE_SIZE },
    }),
    ...paginationPageParam(),
});

export const userHistoryPreviewOptions = (username: string) => ({
    ...userHistoryInfiniteOptions({
        path: { username },
        query: { size: HISTORY_PREVIEW_SIZE },
    }),
    ...paginationPageParam(),
});

export type HistorySource = 'user' | 'following';

export const userHistoryOptions = (username: string, source: HistorySource) =>
    source === 'following'
        ? { ...followingHistoryInfiniteOptions(), ...paginationPageParam() }
        : {
              ...userHistoryInfiniteOptions({ path: { username } }),
              ...paginationPageParam(),
          };

export type FollowListKind = 'followers' | 'followings';

const FOLLOW_LISTS = {
    followers: followersListInfiniteOptions,
    followings: followingListInfiniteOptions,
} satisfies Record<FollowListKind, unknown>;

export function followListOptions(kind: FollowListKind, username: string) {
    // Both endpoints return one page type, so one options type covers them.
    const build = FOLLOW_LISTS[kind] as typeof followersListInfiniteOptions;

    return {
        ...build({ path: { username } }),
        ...paginationPageParam(),
    };
}
