import {
    AnimeMediaEnum,
    type AnimeScheduleArgs,
    type AnimeSearchArgs,
    AnimeStatusEnum,
    type ArticlePreviewResponse,
    type ArticlesListArgs,
    type CollectionResponse,
    type CollectionsListArgs,
    type CommentResponseFeed,
    type SeasonEnum,
} from '@hikka/api';

import type { ScheduleSearch } from './search-schemas';
import { getCurrentSeason } from './season';
import { getOngoingsSort } from './sort';

export type CommunityTab = 'newest' | 'popular' | 'own';

export const COLLECTIONS_NEWEST_SORT = ['created:desc'];
export const COLLECTIONS_POPULAR_SORT = ['system_ranking:desc', 'created:desc'];
export const ARTICLES_NEWEST_SORT = ['created:desc'];
export const ARTICLES_POPULAR_SORT = ['vote_score:desc'];

export const DEFAULT_SCHEDULE_STATUS = [
    AnimeStatusEnum.ONGOING,
    AnimeStatusEnum.ANNOUNCED,
];

export function getOngoingsArgs(): AnimeSearchArgs {
    const season = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();

    return {
        season: [season],
        media_type: [AnimeMediaEnum.TV],
        years: [year, year],
        genres: ['-ecchi', '-hentai'],
        status: [AnimeStatusEnum.ONGOING],
        sort: getOngoingsSort(),
    };
}

export function getScheduleArgs(search: ScheduleSearch): AnimeScheduleArgs {
    const season = (search.season as SeasonEnum) || getCurrentSeason()!;
    const year = Number(search.year) || new Date().getFullYear();
    const status = (
        search.status?.length ? search.status : DEFAULT_SCHEDULE_STATUS
    ) as AnimeStatusEnum[];

    return {
        airing_season: [season, year],
        status,
        only_watch: search.only_watch ?? undefined,
    };
}

export function getCollectionsArgs(
    tab: CommunityTab,
    username?: string,
): CollectionsListArgs {
    if (tab === 'own' && username) {
        return {
            sort: COLLECTIONS_NEWEST_SORT,
            author: username,
            only_public: false,
        };
    }

    return {
        sort:
            tab === 'popular'
                ? COLLECTIONS_POPULAR_SORT
                : COLLECTIONS_NEWEST_SORT,
    };
}

export function getArticlesArgs(
    tab: CommunityTab,
    username?: string,
): ArticlesListArgs {
    if (tab === 'own' && username) {
        return { sort: ARTICLES_NEWEST_SORT, author: username };
    }

    return {
        sort: tab === 'popular' ? ARTICLES_POPULAR_SORT : ARTICLES_NEWEST_SORT,
    };
}

type FeedItem =
    | ArticlePreviewResponse
    | CollectionResponse
    | CommentResponseFeed;

// @hikka/api types the comment `preview` as a loose record.
export type FeedCommentPreview = { slug?: string; title?: string };

export function getFeedItemPath(item: FeedItem): string {
    switch (item.data_type) {
        case 'article':
            return `/articles/${item.slug}`;
        case 'collection':
            return `/collections/${item.reference}`;
        case 'comment': {
            const preview = item.preview as FeedCommentPreview;

            return `/comments/${item.content_type}/${preview.slug}/${item.reference}`;
        }
    }
}

export function getFeedItemCommentsPath(item: FeedItem): string {
    switch (item.data_type) {
        case 'article':
            return `/comments/article/${item.slug}`;
        case 'collection':
            return `/comments/collection/${item.reference}`;
        case 'comment': {
            const preview = item.preview as FeedCommentPreview;

            return `/comments/${item.content_type}/${preview.slug}/${item.reference}`;
        }
    }
}
