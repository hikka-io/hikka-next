import type { Query } from '@tanstack/react-query';

import {
    type ArticlesListArgs,
    animeScheduleInfiniteOptions,
    type FeedArgs,
    feedPageParam,
    followingHistoryInfiniteOptions,
    getArticlesInfiniteOptions,
    getCollectionsInfiniteOptions,
    getFeedInfiniteOptions,
    paginatedInfiniteOptions,
    type ReadContentTypeEnum,
    ReadStatusEnum,
    searchAnimeInfiniteOptions,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    WatchStatusEnum,
} from '@hikka/api';
import {
    type CommunityTab,
    getArticlesArgs,
    getCollectionsArgs,
    getOngoingsArgs,
    getScheduleArgs,
} from '@hikka/core';

export const ONGOINGS_SIZE = 5;
export const HISTORY_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const ARTICLES_PREVIEW_SIZE = 3;
export const FEED_SKELETON_SIZE = 3;

const HOME_META = { home: true } as const;

const tagged = <T extends object>(options: T) => ({
    ...options,
    meta: HOME_META,
});

export const isHomeQuery = (query: Query) => query.meta?.home === true;

export function homeOngoingsOptions() {
    return tagged(
        paginatedInfiniteOptions(
            searchAnimeInfiniteOptions({
                body: getOngoingsArgs(),
                query: { size: ONGOINGS_SIZE },
            }),
        ),
    );
}

export function homeWatchingOptions(username: string) {
    return tagged(
        paginatedInfiniteOptions(
            userWatchListInfiniteOptions({
                path: { username },
                body: {
                    watch_status: WatchStatusEnum.WATCHING,
                    sort: ['watch_updated:desc'],
                },
            }),
        ),
    );
}

export function homeReadingOptions(
    contentType: ReadContentTypeEnum,
    username: string,
) {
    return tagged(
        paginatedInfiniteOptions(
            userReadListInfiniteOptions({
                path: { content_type: contentType, username },
                body: {
                    read_status: ReadStatusEnum.READING,
                    sort: ['read_updated:desc'],
                },
            }),
        ),
    );
}

export function homeScheduleOptions(onlyWatch: boolean) {
    return tagged(
        paginatedInfiniteOptions(
            animeScheduleInfiniteOptions({
                body: getScheduleArgs({ only_watch: onlyWatch || undefined }),
            }),
        ),
    );
}

export function homeFollowingHistoryOptions() {
    return tagged(
        paginatedInfiniteOptions(
            followingHistoryInfiniteOptions({
                query: { size: HISTORY_PREVIEW_SIZE },
            }),
        ),
    );
}

function homeArticlesOptions(body: ArticlesListArgs) {
    return tagged(
        paginatedInfiniteOptions(
            getArticlesInfiniteOptions({
                body,
                query: { size: ARTICLES_PREVIEW_SIZE },
            }),
        ),
    );
}

export const homeArticlesTabOptions = (tab: CommunityTab, username?: string) =>
    homeArticlesOptions(getArticlesArgs(tab, username));

export function homeCollectionsOptions(tab: CommunityTab, username?: string) {
    return tagged(
        paginatedInfiniteOptions(
            getCollectionsInfiniteOptions({
                body: getCollectionsArgs(tab, username),
                query: { size: COLLECTIONS_PREVIEW_SIZE },
            }),
        ),
    );
}

export function homeFeedOptions(feedArgs: FeedArgs) {
    return tagged({
        ...getFeedInfiniteOptions({ body: feedArgs }),
        ...feedPageParam(),
    });
}
