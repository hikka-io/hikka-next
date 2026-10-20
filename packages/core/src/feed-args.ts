import type { FeedArgs, UiFeedSettingsOutput } from '@hikka/api';

export type FeedFilters = Omit<
    UiFeedSettingsOutput,
    'only_followed' | 'widgets'
>;

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
