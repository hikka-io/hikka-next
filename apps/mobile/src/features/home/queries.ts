import {
    AnimeMediaEnum,
    AnimeStatusEnum,
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
    type SeasonEnum,
    searchAnimeInfiniteOptions,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    WatchStatusEnum,
} from '@hikka/api';
import { getCurrentSeason, getOngoingsSort } from '@hikka/core';

import type { CommunityTab } from './types';

export const ONGOINGS_SIZE = 5;
export const HISTORY_PREVIEW_SIZE = 3;
export const COLLECTIONS_PREVIEW_SIZE = 3;
export const ARTICLES_PREVIEW_SIZE = 3;
export const FEED_SKELETON_SIZE = 3;

const NEWEST_SORT = ['created:desc'];
const COLLECTIONS_POPULAR_SORT = ['system_ranking:desc', 'created:desc'];
const ARTICLES_POPULAR_SORT = ['vote_score:desc'];

export function homeOngoingsOptions() {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return paginatedInfiniteOptions(
        searchAnimeInfiniteOptions({
            body: {
                season: [season],
                media_type: [AnimeMediaEnum.TV],
                years: [year, year],
                genres: ['-ecchi', '-hentai'],
                status: [AnimeStatusEnum.ONGOING],
                sort: getOngoingsSort(),
            },
            query: { size: ONGOINGS_SIZE },
        }),
    );
}

export function homeWatchingOptions(username: string) {
    return paginatedInfiniteOptions(
        userWatchListInfiniteOptions({
            path: { username },
            body: {
                watch_status: WatchStatusEnum.WATCHING,
                sort: ['watch_updated:desc'],
            },
        }),
    );
}

export function homeReadingOptions(
    contentType: ReadContentTypeEnum,
    username: string,
) {
    return paginatedInfiniteOptions(
        userReadListInfiniteOptions({
            path: { content_type: contentType, username },
            body: {
                read_status: ReadStatusEnum.READING,
                sort: ['read_updated:desc'],
            },
        }),
    );
}

export function homeScheduleOptions(onlyWatch: boolean) {
    return paginatedInfiniteOptions(
        animeScheduleInfiniteOptions({
            body: {
                airing_season: [
                    getCurrentSeason() as SeasonEnum,
                    new Date().getFullYear(),
                ],
                status: [AnimeStatusEnum.ONGOING, AnimeStatusEnum.ANNOUNCED],
                only_watch: onlyWatch || undefined,
            },
        }),
    );
}

export function homeFollowingHistoryOptions() {
    return paginatedInfiniteOptions(
        followingHistoryInfiniteOptions({
            query: { size: HISTORY_PREVIEW_SIZE },
        }),
    );
}

export function homeArticlesOptions(body: ArticlesListArgs) {
    return paginatedInfiniteOptions(
        getArticlesInfiniteOptions({
            body,
            query: { size: ARTICLES_PREVIEW_SIZE },
        }),
    );
}

export function homeArticlesTabOptions(tab: CommunityTab, username?: string) {
    if (tab === 'own' && username) {
        return homeArticlesOptions({ sort: NEWEST_SORT, author: username });
    }

    return homeArticlesOptions({
        sort: tab === 'popular' ? ARTICLES_POPULAR_SORT : NEWEST_SORT,
    });
}

export function homeCollectionsOptions(tab: CommunityTab, username?: string) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body:
                tab === 'own' && username
                    ? {
                          sort: NEWEST_SORT,
                          author: username,
                          only_public: false,
                      }
                    : {
                          sort:
                              tab === 'popular'
                                  ? COLLECTIONS_POPULAR_SORT
                                  : NEWEST_SORT,
                      },
            query: { size: COLLECTIONS_PREVIEW_SIZE },
        }),
    );
}

export function homeFeedOptions(feedArgs: FeedArgs) {
    return {
        ...getFeedInfiniteOptions({ body: feedArgs }),
        ...feedPageParam(),
    };
}
