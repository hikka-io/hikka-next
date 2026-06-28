import type { QueryClient } from '@tanstack/react-query';

// Queries that embed the user's `.watch` per item and are usually on screen
// when they toggle a status — refetch immediately.
const WATCH_OWNED_IDS = [
    'userWatchList',
    'characterAnime',
    'personAnime',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];

// Also embed `.watch`, but are high-cardinality infinite lists — marked stale
// without refetching every loaded page (see invalidateWatchState).
const WATCH_CATALOG_IDS = ['searchAnime', 'animeRecommendations'];

// Same split for `.read` status.
const READ_OWNED_IDS = [
    'userReadList',
    'characterManga',
    'characterNovel',
    'personManga',
    'personNovel',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];

const READ_CATALOG_IDS = ['searchManga', 'searchNovel'];

/** Comment lists + content-list queries that embed a comments count/preview. */
const COMMENT_IDS = [
    'commentsList',
    'getContentsList',
    'thread',
    'latestComments',
];

/** Community-edit list queries (the `/edit` index, top stats, content todo). */
const EDIT_LIST_IDS = ['getEdits', 'editsTop', 'getContentEditTodo'];

/** Collection list + detail queries. */
const COLLECTION_IDS = ['getCollections', 'getCollection'];

/** Article list + detail queries. */
const ARTICLE_IDS = ['getArticles', 'getArticleTop', 'getArticle'];

/** Follow lists/stats + the personalised "following" feed. */
const FOLLOW_IDS = [
    'followingList',
    'followersList',
    'followStats',
    'followingHistory',
    'getFeed', // the home feed widget
    'getWatchFollowing',
    'getReadFollowing',
];

/** Content-detail queries keyed by slug (used when an accepted edit mutates content). */
const CONTENT_DETAIL_IDS = [
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
];

/** Read the generated query key's leading `_id` discriminator (`[{ _id, ... }]`). */
export function queryId(queryKey: readonly unknown[]): string | undefined {
    return (queryKey[0] as { _id?: string } | undefined)?._id;
}

export type InvalidateOptions = {
    /**
     * When `false`, matching queries are marked stale but not refetched
     * immediately (`refetchType: 'none'`) — used by the debounced trackers to
     * avoid flicker during rapid optimistic updates. Defaults to `true`.
     */
    refetch?: boolean;
};

/** Map our `refetch` flag onto TanStack's `refetchType`. */
function refetchTypeFor(options?: InvalidateOptions): 'none' | undefined {
    return options?.refetch === false ? 'none' : undefined;
}

/**
 * Invalidate every cached query whose generated `_id` is in `ids`, plus any
 * query the optional `extraMatch` predicate accepts (OR-combined). This is the
 * shared replacement for the old `@hikka/react` `createMutation`
 * `invalidateQueries` mechanism — call it (or one of the named helpers below)
 * from a mutation `onSuccess` instead of hand-rolling a `predicate`.
 */
export function invalidateByIds(
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
 * Invalidate every cache reflecting the user's anime watch status: their own
 * list plus all content-list queries that embed `.watch` per item. Active
 * queries refetch immediately; inactive ones refetch on next view.
 */
export function invalidateWatchState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, WATCH_OWNED_IDS, options),
        invalidateByIds(queryClient, WATCH_CATALOG_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/** Invalidate every cache reflecting the user's manga/novel read status. */
export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, READ_OWNED_IDS, options),
        invalidateByIds(queryClient, READ_CATALOG_IDS, { refetch: false }),
    ]).then(() => undefined);
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
    return invalidateByIds(queryClient, ['profile'], options);
}

/** Invalidate the notification list + unseen-count after marking seen. */
export function invalidateNotifications(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(
        queryClient,
        ['notifications', 'unseenNotificationsCount'],
        options,
    );
}

/** Invalidate the ignored-notification settings query after saving toggles. */
export function invalidateIgnoredNotifications(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, ['getIgnoredNotifications'], options);
}

/** Invalidate the user's OAuth client list after create/update/delete. */
export function invalidateUserClients(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, ['listUserClients'], options);
}

/** Invalidate the favourite lists after toggling a favourite. */
export function invalidateFavourites(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, ['favouriteList'], options);
}

/**
 * Invalidate everything a follow/unfollow can change: follow lists/stats, the
 * personalised feed, the article/collection feeds (which order by followed
 * authors), and the target user's profile (`is_followed`). Mirrors the old
 * `useCreateFollow`/`useDeleteFollow` invalidation set.
 */
export function invalidateFollow(
    queryClient: QueryClient,
    targetUsername: string,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(
        queryClient,
        [...FOLLOW_IDS, ...ARTICLE_IDS, ...COLLECTION_IDS],
        options,
        (query) =>
            queryId(query.queryKey) === 'userProfile' &&
            JSON.stringify(query.queryKey).includes(targetUsername),
    );
}

/**
 * Invalidate the caches that embed a vote score/my-score for the voted entity:
 * article and collection detail plus comment lists (comments are voted through
 * the same endpoint). The standalone `getVote` status is updated separately via
 * `setQueryData`.
 */
export function invalidateVote(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(
        queryClient,
        ['getArticle', 'getCollection', ...COMMENT_IDS],
        options,
    );
}

/**
 * Invalidate the content-detail queries for a slug — used when an accepted edit
 * mutates the underlying content (mirrors the old `invalidateContentQueries`).
 */
export function invalidateContentBySlug(
    queryClient: QueryClient,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    const idSet = new Set(CONTENT_DETAIL_IDS);
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            return (
                id !== undefined &&
                idSet.has(id) &&
                JSON.stringify(query.queryKey).includes(slug)
            );
        },
        refetchType: refetchTypeFor(options),
    });
}
