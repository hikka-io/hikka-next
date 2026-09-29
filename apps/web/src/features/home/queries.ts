import type { QueryClient } from '@tanstack/react-query';

import {
    AnimeMediaEnum,
    AnimeStatusEnum,
    type Client,
    type FeedArgs,
    profileUiQueryKey,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
    type UiFeedSettingsOutput,
    type UserCustomizationResponse,
} from '@hikka/api';

import { getSessionFromPagesCache } from '@/utils/auth';
import { DEFAULT_USER_UI, mergePreferences } from '@/utils/customization';
import { getCurrentSeason } from '@/utils/season';
import { getOngoingsSort } from '@/utils/sort';

type FeedFilters = Omit<UiFeedSettingsOutput, 'only_followed' | 'widgets'>;

export function ongoingsOptions({
    size,
    client,
}: {
    size: number;
    client?: Client;
}) {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return searchAnimeInfiniteOptions({
        body: {
            season: [season],
            media_type: [AnimeMediaEnum.TV],
            years: [year, year],
            genres: ['-ecchi', '-hentai'],
            status: [AnimeStatusEnum.ONGOING],
            sort: getOngoingsSort(),
        },
        query: { size },
        client,
    });
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

/** The body the feed widget starts with, from the cached session and UI prefs; null when the widget skips the feed. */
export function initialFeedArgs(queryClient: QueryClient): FeedArgs | null {
    const ui = queryClient.getQueryData<UserCustomizationResponse>(
        profileUiQueryKey(),
    );
    const feed =
        mergePreferences(DEFAULT_USER_UI.preferences, ui?.preferences).feed ??
        {};
    const filters = getSessionFromPagesCache(queryClient) ? feed : {};

    if (isFeedDisabled(filters)) return null;

    return buildFeedArgs(filters, feed.only_followed ?? false);
}
