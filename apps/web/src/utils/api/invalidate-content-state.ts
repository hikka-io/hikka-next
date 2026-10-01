import type { QueryClient, QueryKey, Updater } from '@tanstack/react-query';

import {
    type FavouriteContentTypeEnum,
    type FavouriteResponse,
    getEditQueryKey,
    getFavouriteQueryKey,
    getIgnoredNotificationsQueryKey,
    getVoteQueryKey,
    type IgnoredNotificationsResponse,
    profileUiQueryKey,
    type ReadResponse,
    readGetQueryKey,
    type SetVoteData,
    type UserCustomizationResponse,
    VoteContentTypeEnum,
    type VoteResponse,
    type WatchResponse,
    watchGetQueryKey,
} from '@hikka/api';

import {
    type FollowChange,
    patchEmbeddedFollow,
    patchEmbeddedStatus,
    patchEmbeddedVote,
    type StatusField,
} from './patch-embedded';
import { matchesPath, type QueryId, queryId } from './query-id';

// The user's own watch list — refetched on every change so the entry reorders
// (sorted by updated-at). Its status is top-level, so the patcher below skips it.
const WATCH_LIST_IDS: readonly QueryId[] = ['userWatchList'];

// Every other query that embeds the user's `.watch` per content item (catalog,
// collections, character/person, franchise, favourites). Patched in place by
// `writeWatchToCaches` and only stale-marked — never refetched, so one toggle
// never reloads a large grid.
const WATCH_EMBED_IDS: readonly QueryId[] = [
    'searchAnime',
    'animeRecommendations',
    'characterAnime',
    'personAnime',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];

// Same split for `.read` status.
const READ_LIST_IDS: readonly QueryId[] = ['userReadList'];

const READ_EMBED_IDS: readonly QueryId[] = [
    'searchManga',
    'searchNovel',
    'characterManga',
    'characterNovel',
    'personManga',
    'personNovel',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];

const COMMENT_LIST_IDS: readonly QueryId[] = [
    'commentsList',
    'getCommentsList',
    'getCommentsUser',
    'thread',
    'latestComments',
];

/** Comment lists + content-list queries that embed a comments count/preview. */
const COMMENT_IDS: readonly QueryId[] = [
    ...COMMENT_LIST_IDS,
    'animeSlug',
    'mangaInfo',
    'novelInfo',
];

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
const COLLECTION_IDS: readonly QueryId[] = ['getCollections', 'getCollection'];

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

const WATCH_EMBED_SET = new Set(WATCH_EMBED_IDS);
const READ_EMBED_SET = new Set(READ_EMBED_IDS);
const COMMENT_LIST_SET = new Set(COMMENT_LIST_IDS);

type InvalidateOptions = {
    /**
     * When `false`, matching queries are marked stale but not refetched
     * immediately (`refetchType: 'none'`) — used by the debounced trackers to
     * avoid flicker during rapid optimistic updates. Defaults to `true`.
     */
    refetch?: boolean;
};

function refetchTypeFor(options?: InvalidateOptions): 'none' | undefined {
    return options?.refetch === false ? 'none' : undefined;
}

/**
 * Invalidate every cached query whose generated `_id` is in `ids`, plus any
 * query the optional `extraMatch` predicate accepts (OR-combined).
 */
function invalidateByIds(
    queryClient: QueryClient,
    ids: readonly string[],
    options?: InvalidateOptions,
    extraMatch?: (query: { queryKey: readonly unknown[] }) => boolean,
): Promise<void> {
    const idSet = new Set(ids);
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            if (id !== undefined && idSet.has(id)) return true;
            return extraMatch ? extraMatch(query) : false;
        },
        refetchType: refetchTypeFor(options),
    });
}

/**
 * Reconcile every cache reflecting the user's anime watch status: refetch the
 * user's own list (it reorders/filters by status) and mark the status-embedding
 * lists stale so they refetch on their next mount. The on-screen update is handled
 * optimistically by `writeWatchToCaches`; pass `{ refetch: false }` to also skip
 * the own-list refetch (debounced trackers, to avoid mid-interaction reorder).
 */
export function invalidateWatchState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, WATCH_LIST_IDS, options),
        invalidateByIds(queryClient, WATCH_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/** Invalidate every cache reflecting the user's manga/novel read status. */
export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, READ_LIST_IDS, options),
        invalidateByIds(queryClient, READ_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/**
 * Patch every query whose `_id` is in `ids`, leaving the ones the patch does
 * not change untouched: `setQueryData` would otherwise mark them fresh.
 */
function patchQueries(
    queryClient: QueryClient,
    ids: ReadonlySet<string>,
    patch: (data: unknown) => unknown,
): void {
    queryClient.setQueriesData<unknown>(
        { predicate: (query) => ids.has(queryId(query.queryKey) ?? '') },
        (data: unknown) => {
            const next = patch(data);
            return next === data ? undefined : next;
        },
    );
}

/** Patch the embedded status of `slug` across every query whose `_id` is in `ids`. */
function patchEmbeddedStatusInQueries(
    queryClient: QueryClient,
    ids: ReadonlySet<string>,
    slug: string,
    field: StatusField,
    next: object | undefined,
): void {
    patchQueries(queryClient, ids, (data) =>
        patchEmbeddedStatus(data, slug, field, next),
    );
}

/**
 * Reflect a watch add/update in the per-content (`watchGet`) cache and in every
 * status-embedding list. Use this from a watch mutation `onSuccess`; pair with
 * `invalidateWatchState` (or call `applyWatchMutation`, which does both).
 */
export function writeWatchToCaches(
    queryClient: QueryClient,
    data: WatchResponse,
): void {
    const { anime, ...base } = data;
    queryClient.setQueryData(
        watchGetQueryKey({ path: { slug: anime.slug } }),
        data,
    );
    patchEmbeddedStatusInQueries(
        queryClient,
        WATCH_EMBED_SET,
        anime.slug,
        'watch',
        base,
    );
}

/** `writeWatchToCaches` + `invalidateWatchState`. The standard watch onSuccess. */
export function applyWatchMutation(
    queryClient: QueryClient,
    data: WatchResponse,
    options?: InvalidateOptions,
): Promise<void> {
    writeWatchToCaches(queryClient, data);
    return invalidateWatchState(queryClient, options);
}

// An in-flight fetch of the entry would land after this write and restore the deleted entry.
async function setQueryDataAfterCancel(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    data: unknown,
): Promise<void> {
    await queryClient.cancelQueries({ queryKey, exact: true });
    queryClient.setQueryData(queryKey, data);
}

/** Clear a deleted watch entry from the per-content + embedding caches, then invalidate. */
export async function applyWatchDeletion(
    queryClient: QueryClient,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    await setQueryDataAfterCancel(
        queryClient,
        watchGetQueryKey({ path: { slug } }),
        null,
    );
    patchEmbeddedStatusInQueries(
        queryClient,
        WATCH_EMBED_SET,
        slug,
        'watch',
        undefined,
    );
    return invalidateWatchState(queryClient, options);
}

/** Read mirror of `writeWatchToCaches`. */
export function writeReadToCaches(
    queryClient: QueryClient,
    data: ReadResponse,
): void {
    const { content, ...base } = data;
    queryClient.setQueryData(
        readGetQueryKey({
            path: { content_type: content.data_type, slug: content.slug },
        }),
        data,
    );
    patchEmbeddedStatusInQueries(
        queryClient,
        READ_EMBED_SET,
        content.slug,
        'read',
        base,
    );
}

/** Read mirror of `applyWatchMutation`. */
export function applyReadMutation(
    queryClient: QueryClient,
    data: ReadResponse,
    options?: InvalidateOptions,
): Promise<void> {
    writeReadToCaches(queryClient, data);
    return invalidateReadState(queryClient, options);
}

/** Read mirror of `applyWatchDeletion`. */
export async function applyReadDeletion(
    queryClient: QueryClient,
    content_type: ReadResponse['content']['data_type'],
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    await setQueryDataAfterCancel(
        queryClient,
        readGetQueryKey({ path: { content_type, slug } }),
        null,
    );
    patchEmbeddedStatusInQueries(
        queryClient,
        READ_EMBED_SET,
        slug,
        'read',
        undefined,
    );
    return invalidateReadState(queryClient, options);
}

/** Invalidate comment lists/threads after a comment write/edit/delete. */
export function invalidateComments(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, COMMENT_IDS, options);
}

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
    if (target.content_type === VoteContentTypeEnum.COMMENT) {
        patchQueries(queryClient, COMMENT_LIST_SET, (cached) =>
            patchEmbeddedVote(cached, target.slug, data.score),
        );
    }
    return invalidateVote(queryClient, target, options);
}

function invalidateVote(
    queryClient: QueryClient,
    { content_type, slug }: SetVoteData['path'],
    options?: InvalidateOptions,
): Promise<void> {
    if (content_type === VoteContentTypeEnum.COMMENT) {
        return invalidateByIds(queryClient, COMMENT_LIST_IDS, {
            refetch: false,
        });
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
