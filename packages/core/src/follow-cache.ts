import type { QueryClient } from '@tanstack/query-core';

import {
    type InvalidateOptions,
    invalidateByIds,
    patchQueries,
} from './content-cache';
import { type FollowChange, patchEmbeddedFollow } from './patch-embedded';
import { matchesPath, type QueryId } from './query-id';

/** Article list + detail queries. */
export const ARTICLE_IDS: readonly QueryId[] = [
    'getArticles',
    'getArticleTop',
    'getArticle',
];

export const USER_COLLECTIONS_ID: QueryId = 'getUserCollections';

/** Collection list + detail queries. */
export const COLLECTION_IDS: readonly QueryId[] = [
    'getCollections',
    'getCollection',
    USER_COLLECTIONS_ID,
];

const USER_PROFILE_ID: QueryId = 'userProfile';

/** Follow lists/stats + the personalised "following" feeds. */
export const FOLLOW_IDS: readonly QueryId[] = [
    'followingList',
    'followersList',
    'followStats',
    'followingHistory',
    'getFeed',
    'getWatchFollowing',
    'getReadFollowing',
];

/** Every query embedding a user object whose `is_followed` a follow flips. */
export const FOLLOW_EMBED_IDS: readonly QueryId[] = [
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
    'favouriteList',
    USER_PROFILE_ID,
];

const FOLLOW_EMBED_SET = new Set<string>(FOLLOW_EMBED_IDS);

/**
 * Reflect a follow/unfollow: patch `is_followed` into the embedded authors and
 * the target's profile, refetch the follow lists/stats, the personalised feed
 * and the target's profile, and only stale-mark the article/collection lists
 * (they order by followed authors) so one click never reloads a large list.
 */
export function applyFollowChange(
    queryClient: QueryClient,
    change: FollowChange,
    options?: InvalidateOptions,
): Promise<void> {
    patchQueries(queryClient, FOLLOW_EMBED_SET, (data) =>
        patchEmbeddedFollow(data, change),
    );
    return Promise.all([
        invalidateByIds(queryClient, FOLLOW_IDS, options, (query) =>
            matchesPath(
                query.queryKey,
                USER_PROFILE_ID,
                'username',
                change.username,
            ),
        ),
        invalidateByIds(queryClient, [...ARTICLE_IDS, ...COLLECTION_IDS], {
            refetch: false,
        }),
    ]).then(() => undefined);
}
