import type { QueryId } from './query-id';

// The single owner of every query-id group more than one cache module (or an app) uses.

export const COMMENT_LIST_IDS: readonly QueryId[] = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
];

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

export const USER_PROFILE_ID: QueryId = 'userProfile';

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

/** Queries that embed a user's avatar; stale-marked so a changed avatar shows on the next mount. */
export const AVATAR_EMBED_IDS: readonly QueryId[] = [
    ...COMMENT_LIST_IDS,
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
];
