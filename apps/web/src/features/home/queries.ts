import type { QueryClient } from '@tanstack/react-query';

import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    type ArticlesListArgs,
    animeScheduleInfiniteOptions,
    type Client,
    type FeedArgs,
    followingHistoryInfiniteOptions,
    getArticlesInfiniteOptions,
    paginationPageParam,
    profileUiQueryKey,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
    type UiFeedSettingsOutput,
    type UiFeedWidget,
    type UserCustomizationResponse,
    userWatchListInfiniteOptions,
    WatchStatusEnum,
} from '@hikka/api';

import { getSessionFromPagesCache } from '@/utils/auth';
import { DEFAULT_USER_UI, mergePreferences } from '@/utils/customization';
import { getCurrentSeason } from '@/utils/season';
import { getOngoingsSort } from '@/utils/sort';

const HISTORY_PREVIEW_SIZE = 3;
export const HOME_ARTICLES_SIZE = 3;
export const ONGOINGS_SIZE = 5;

export const HOME_ARTICLES_NEWEST_SORT = ['created:desc'];
export const HOME_ARTICLES_POPULAR_SORT = ['vote_score:desc'];

type FeedFilters = Omit<UiFeedSettingsOutput, 'only_followed' | 'widgets'>;

export function ongoingsOptions(client?: Client) {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return {
        ...searchAnimeInfiniteOptions({
            body: {
                season: [season],
                media_type: [AnimeMediaEnum.TV],
                years: [year, year],
                genres: ['-ecchi', '-hentai'],
                status: [AnimeStatusEnum.ONGOING],
                sort: getOngoingsSort(),
            },
            query: { size: ONGOINGS_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function homeWatchingOptions(username: string, client?: Client) {
    return {
        ...userWatchListInfiniteOptions({
            path: { username },
            body: {
                watch_status: WatchStatusEnum.WATCHING,
                sort: ['watch_updated:desc'],
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function homeScheduleOptions(onlyWatch: boolean, client?: Client) {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return {
        ...animeScheduleInfiniteOptions({
            body: {
                airing_season: [season, year],
                status: [AnimeStatusEnum.ONGOING, AnimeStatusEnum.ANNOUNCED],
                only_watch: onlyWatch || undefined,
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function followingHistoryPreviewOptions(client?: Client) {
    return {
        ...followingHistoryInfiniteOptions({
            query: { size: HISTORY_PREVIEW_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function homeArticlesOptions(body: ArticlesListArgs, client?: Client) {
    return {
        ...getArticlesInfiniteOptions({
            body,
            query: { size: HOME_ARTICLES_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function buildFeedArgs(
    filters: FeedFilters,
    onlyFollowed: boolean,
): FeedArgs {
    const args: FeedArgs = {};

    if (onlyFollowed) args.only_followed = true;

    if (filters.feed_content_types != null)
        args.feed_content_types = filters.feed_content_types;
    if (filters.comment_content_types?.length)
        args.comment_content_types = filters.comment_content_types;
    if (filters.article_content_types?.length)
        args.article_content_types = filters.article_content_types;
    if (filters.article_categories?.length)
        args.article_categories = filters.article_categories;
    if (filters.collection_content_types?.length)
        args.collection_content_types = filters.collection_content_types;
    if (filters.review_content_types?.length)
        args.review_content_types = filters.review_content_types;

    return args;
}

/** An empty list reads as "no filter" on the backend, so all sections off must skip the request. */
export const isFeedDisabled = (filters: FeedFilters) =>
    filters.feed_content_types?.length === 0;

const cachedFeedSettings = (queryClient: QueryClient) =>
    mergePreferences(
        DEFAULT_USER_UI.preferences,
        queryClient.getQueryData<UserCustomizationResponse>(profileUiQueryKey())
            ?.preferences,
    ).feed ?? {};

/** The body the feed widget starts with, from the cached session and UI prefs; null when the widget skips the feed. */
export function initialFeedArgs(queryClient: QueryClient): FeedArgs | null {
    const feed = cachedFeedSettings(queryClient);
    const filters = getSessionFromPagesCache(queryClient) ? feed : {};

    if (isFeedDisabled(filters)) return null;

    return buildFeedArgs(filters, feed.only_followed ?? false);
}

/** Whether the home layout the session will render includes the widget; anonymous visitors get the default layout. */
export function feedHasWidget(
    queryClient: QueryClient,
    slug: UiFeedWidget['slug'],
): boolean {
    const feed = getSessionFromPagesCache(queryClient)
        ? cachedFeedSettings(queryClient)
        : DEFAULT_USER_UI.preferences.feed;

    return !!feed?.widgets?.some((widget) => widget.slug === slug);
}
