import type {
    InfiniteData,
    QueryClient,
    QueryKey,
    Updater,
} from '@tanstack/react-query';

import {
    type FavouriteContentTypeEnum,
    type FavouriteResponse,
    getEditQueryKey,
    getFavouriteQueryKey,
    getIgnoredNotificationsQueryKey,
    getVoteQueryKey,
    type IgnoredNotificationsResponse,
    profileUiQueryKey,
    type SetVoteData,
    type UserCollectionResponse,
    type UserCollectionsListResponse,
    type UserCustomizationResponse,
    VoteContentTypeEnum,
    type VoteResponse,
} from '@hikka/api';
import {
    applyCommentVote,
    COMMENT_LIST_IDS,
    type FollowChange,
    type InvalidateOptions,
    invalidateByIds,
    matchesPath,
    patchEmbeddedFollow,
    patchQueries,
    type QueryId,
    queryId,
    READ_EMBED_IDS,
    refetchTypeFor,
    setQueryDataAfterCancel,
    WATCH_EMBED_IDS,
} from '@hikka/core';

// Watch/read and comment cache writers live in @hikka/core, shared with the mobile app.
export {
    applyCommentVote,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateComments,
    invalidateReadState,
    invalidateWatchState,
    writeReadToCaches,
    writeWatchToCaches,
} from '@hikka/core';

/** Community-edit list queries (the `/edit` index, top stats, content todo). */
const EDIT_LIST_IDS: readonly QueryId[] = [
    'getEdits',
    'editsTop',
    'getContentEditTodo',
    'getTodoAnimeList',
    'getTodoMangaList',
    'getTodoNovelList',
    'getTodoCharacterList',
    'getTodoPersonList',
];

/** Collection list + detail queries. */
const USER_COLLECTIONS_ID: QueryId = 'getUserCollections';

const COLLECTION_IDS: readonly QueryId[] = [
    'getCollections',
    'getCollection',
    USER_COLLECTIONS_ID,
];

/** Article list + detail queries. */
const ARTICLE_IDS: readonly QueryId[] = [
    'getArticles',
    'getArticleTop',
    'getArticle',
];

/** Follow lists/stats + the personalised "following" feed. */
const FOLLOW_IDS: readonly QueryId[] = [
    'followingList',
    'followersList',
    'followStats',
    'followingHistory',
    'getFeed', // the home feed widget
    'getWatchFollowing',
    'getReadFollowing',
];

/** Content-detail queries keyed by slug (used when an accepted edit mutates content). */
const CONTENT_DETAIL_IDS: readonly QueryId[] = [
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'characterInfo',
    'personInfo',
    'contentFranchise',
    'animeCharacters',
    'mangaCharacters',
    'novelCharacters',
    'animeStaff',
    'animeEpisodes',
    'characterVoices',
    'personVoices',
];

const VOTE_DETAIL = {
    [VoteContentTypeEnum.ARTICLE]: ['getArticle', 'slug'],
    [VoteContentTypeEnum.COLLECTION]: ['getCollection', 'reference'],
} as const satisfies Record<
    Exclude<VoteContentTypeEnum, typeof VoteContentTypeEnum.COMMENT>,
    readonly [QueryId, string]
>;

const SESSION_IDS: readonly QueryId[] = ['profile'];

const NOTIFICATION_IDS: readonly QueryId[] = [
    'notifications',
    'unseenNotificationsCount',
];

const USER_CLIENT_IDS: readonly QueryId[] = ['listUserClients'];

const AUTH_TOKEN_IDS: readonly QueryId[] = ['thirdPartyAuthTokens'];

const FAVOURITE_IDS: readonly QueryId[] = ['favouriteList'];

const USER_PROFILE_ID: QueryId = 'userProfile';

// Every query embedding a user object whose `is_followed` a follow flips.
const FOLLOW_EMBED_SET = new Set<QueryId>([
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
    ...FAVOURITE_IDS,
    USER_PROFILE_ID,
]);

/** Invalidate the community-edit list queries after an edit mutation. */
export function invalidateEdits(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, EDIT_LIST_IDS, options);
}

/** Invalidate a single community-edit detail (`getEdit`) after accept/close/deny/update. */
export function invalidateEditDetail(
    queryClient: QueryClient,
    editId: number,
    options?: InvalidateOptions,
): Promise<void> {
    return queryClient.invalidateQueries({
        queryKey: getEditQueryKey({ path: { edit_id: editId } }),
        refetchType: refetchTypeFor(options),
    });
}

/** Invalidate collection list/detail queries after a collection mutation. */
export function invalidateCollections(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, COLLECTION_IDS, options);
}

/**
 * Store a quick add/remove result: the response is authoritative for that collection, so the
 * picker lists are patched (membership only for the same title) and other collection queries
 * refresh in the background.
 */
export function applyUserCollectionChange(
    queryClient: QueryClient,
    slug: string,
    saved: UserCollectionResponse,
): void {
    const lists = queryClient.getQueryCache().findAll({
        predicate: (query) => queryId(query.queryKey) === USER_COLLECTIONS_ID,
    });

    for (const { queryKey } of lists) {
        const sameTitle =
            (queryKey[0] as { query?: { content?: string } }).query?.content ===
            slug;
        queryClient.setQueryData<InfiniteData<UserCollectionsListResponse>>(
            queryKey,
            (data) =>
                data && {
                    ...data,
                    pages: data.pages.map((page) => ({
                        ...page,
                        list: page.list.map((collection) => {
                            if (collection.reference !== saved.reference) {
                                return collection;
                            }
                            return sameTitle
                                ? saved
                                : {
                                      ...saved,
                                      has_content: collection.has_content,
                                      content_label: collection.content_label,
                                  };
                        }),
                    })),
                },
        );
    }

    void invalidateByIds(
        queryClient,
        COLLECTION_IDS.filter((id) => id !== USER_COLLECTIONS_ID),
    );
}

/** Invalidate article list/detail queries after an article mutation. */
export function invalidateArticles(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, ARTICLE_IDS, options);
}

/** Invalidate the current-user session/profile query (`profileOptions`). */
export function invalidateSession(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, SESSION_IDS, options);
}

// Queries whose response depends on the viewer; the anonymous content info also lacks the restricted links.
const SESSION_DEPENDENT_IDS: readonly QueryId[] = [
    'animeSlug',
    'mangaInfo',
    'novelInfo',
    'watchGet',
    'readGet',
    'getFavourite',
    'getVote',
    ...WATCH_EMBED_IDS,
    ...READ_EMBED_IDS,
    ...COMMENT_LIST_IDS,
    ...FOLLOW_EMBED_SET,
];

/** After a login: refetch the on-screen per-viewer queries and stale-mark the rest. */
export function invalidateSessionDependentQueries(
    queryClient: QueryClient,
): Promise<void> {
    return invalidateByIds(queryClient, SESSION_DEPENDENT_IDS);
}

// Queries that embed a user's avatar; stale-marked so a changed avatar shows on the next mount.
const AVATAR_EMBED_IDS: readonly QueryId[] = [
    ...COMMENT_LIST_IDS,
    ...ARTICLE_IDS,
    ...COLLECTION_IDS,
    'followingList',
    'followersList',
];

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

/** Invalidate the notification list + unseen-count after marking seen. */
export function invalidateNotifications(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, NOTIFICATION_IDS, options);
}

/** Invalidate the user's OAuth client list after create/update/delete. */
export function invalidateUserClients(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, USER_CLIENT_IDS, options);
}

/** Invalidate the authorized third-party apps list after revoking access. */
export function invalidateAuthTokens(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, AUTH_TOKEN_IDS, options);
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

/** Drop an infinite list with several loaded pages before a page jump restarts it. */
export function resetPageList(
    queryClient: QueryClient,
    queryKey: QueryKey,
): void {
    queryClient.removeQueries({ queryKey });
}

/** Invalidate the favourite lists after toggling a favourite. */
function invalidateFavourites(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, FAVOURITE_IDS, options);
}

/** Write an added favourite into the per-content cache, then invalidate the lists. */
export function applyFavouriteMutation(
    queryClient: QueryClient,
    content_type: FavouriteContentTypeEnum,
    slug: string,
    data: FavouriteResponse,
    options?: InvalidateOptions,
): Promise<void> {
    queryClient.setQueryData(
        getFavouriteQueryKey({ path: { content_type, slug } }),
        data,
    );
    return invalidateFavourites(queryClient, options);
}

/** Favourite mirror of `applyWatchDeletion`. */
export async function applyFavouriteDeletion(
    queryClient: QueryClient,
    content_type: FavouriteContentTypeEnum,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    await setQueryDataAfterCancel(
        queryClient,
        getFavouriteQueryKey({ path: { content_type, slug } }),
        null,
    );
    return invalidateFavourites(queryClient, options);
}

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

/**
 * Store a vote and refresh what embeds it. The vote button is optimistic, so a
 * comment vote patches the comment lists and only stale-marks them; an
 * article/collection vote refetches that one detail.
 */
export function applyVoteMutation(
    queryClient: QueryClient,
    target: SetVoteData['path'],
    data: VoteResponse,
    options?: InvalidateOptions,
): Promise<void> {
    queryClient.setQueryData(getVoteQueryKey({ path: target }), data);
    const { content_type, slug } = target;
    if (content_type === VoteContentTypeEnum.COMMENT) {
        return applyCommentVote(queryClient, slug, data.score);
    }
    const [id, field] = VOTE_DETAIL[content_type];
    return queryClient.invalidateQueries({
        predicate: (query) => matchesPath(query.queryKey, id, field, slug),
        refetchType: refetchTypeFor(options),
    });
}

/**
 * Invalidate the content-detail queries for a slug — used when an accepted edit
 * mutates the underlying content; refetches inactive queries too, since the
 * detail loaders serve cached data.
 */
export function invalidateContentBySlug(
    queryClient: QueryClient,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    return queryClient.invalidateQueries({
        predicate: (query) =>
            CONTENT_DETAIL_IDS.some((id) =>
                matchesPath(query.queryKey, id, 'slug', slug),
            ),
        refetchType: refetchTypeFor(options) ?? 'all',
    });
}
