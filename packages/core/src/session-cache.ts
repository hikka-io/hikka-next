import type { QueryClient, Updater } from '@tanstack/query-core';

import {
    getIgnoredNotificationsQueryKey,
    type IgnoredNotificationsResponse,
    profileUiQueryKey,
    type UserCustomizationResponse,
} from '@hikka/api';

import {
    type InvalidateOptions,
    invalidateByIds,
    refetchTypeFor,
} from './content-cache';
import { matchesPath, type QueryId } from './query-id';

export const COMMENT_LIST_IDS: readonly QueryId[] = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
];

/** Collection list + detail queries. */
export const USER_COLLECTIONS_ID: QueryId = 'getUserCollections';

export const COLLECTION_IDS: readonly QueryId[] = [
    'getCollections',
    'getCollection',
    USER_COLLECTIONS_ID,
];

/** Article list + detail queries. */
export const ARTICLE_IDS: readonly QueryId[] = [
    'getArticles',
    'getArticleTop',
    'getArticle',
];

export const USER_PROFILE_ID: QueryId = 'userProfile';

const SESSION_IDS: readonly QueryId[] = ['profile'];

// Queries that embed a user's avatar; stale-marked so a changed avatar shows on the next mount.
const AVATAR_EMBED_IDS: readonly QueryId[] = [
    ...COMMENT_LIST_IDS,
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
];

/** Invalidate the current-user session/profile query (`profileOptions`). */
export function invalidateSession(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, SESSION_IDS, options);
}

/** Refetch one user's public profile (avatar, cover) after they change it and stale-mark the lists that embed the avatar. */
export function invalidateUserProfile(
    queryClient: QueryClient,
    username: string,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        queryClient.invalidateQueries({
            predicate: (query) =>
                matchesPath(
                    query.queryKey,
                    USER_PROFILE_ID,
                    'username',
                    username,
                ),
            refetchType: refetchTypeFor(options),
        }),
        invalidateByIds(queryClient, AVATAR_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/** Replace the cached ignored-notification types with the saved response. */
export function writeIgnoredNotifications(
    queryClient: QueryClient,
    saved: IgnoredNotificationsResponse,
): void {
    queryClient.setQueryData(getIgnoredNotificationsQueryKey(), saved);
}

/** Write the viewer's UI customization: an optimistic patch or a rollback snapshot. */
export function writeSessionUI(
    queryClient: QueryClient,
    updater: Updater<
        UserCustomizationResponse | undefined,
        UserCustomizationResponse | undefined
    >,
): void {
    queryClient.setQueryData(profileUiQueryKey(), updater);
}
