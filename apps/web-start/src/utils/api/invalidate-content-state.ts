import type { QueryClient } from '@tanstack/react-query';

import {
    type ReadResponse,
    readGetQueryKey,
    type WatchResponse,
    watchGetQueryKey,
} from '@hikka/api';

// The user's own watch list — refetched on every change so the entry reorders
// (sorted by updated-at). Its status is top-level, so the patcher below skips it.
const WATCH_LIST_IDS = ['userWatchList'];

// Every other query that embeds the user's `.watch` per content item (catalog,
// collections, character/person, franchise, favourites). Patched in place by
// `writeWatchToCaches` and only stale-marked — never refetched, so one toggle
// never reloads a large grid.
const WATCH_EMBED_IDS = [
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
const READ_LIST_IDS = ['userReadList'];

const READ_EMBED_IDS = [
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
 * Reconcile every cache reflecting the user's anime watch status: refetch the
 * user's own list (it reorders/filters by status) and mark the status-embedding
 * lists stale as a refetch-on-focus backstop. The on-screen update is handled
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

// --- Optimistic status patching ------------------------------------------
//
// Cards read the user's status from the object embedded per content item
// (`item.watch[0]` / `item.read[0]`). Those queries aren't refetched on a change
// (WATCH_EMBED_IDS), so we patch the cache directly. The same `{ slug, watch|read }`
// object sits at different depths per query — top-level in catalogs, `item.content`
// in collections, `item.anime` in character/person rows — so one recursive walk
// patches it wherever it lives, instead of a patcher per shape.

type StatusField = 'watch' | 'read';

const WATCH_EMBED_SET = new Set(WATCH_EMBED_IDS);
const READ_EMBED_SET = new Set(READ_EMBED_IDS);

/**
 * Return `node` with the embedded `field` array of every `{ slug, [field] }`
 * content object matching `slug` replaced by `next` (or cleared). Walks arbitrary
 * nesting and preserves referential identity for unchanged branches — so
 * `setQueriesData` skips notifying observers of queries that didn't contain the
 * slug, and React only re-renders the cards that actually changed.
 */
function patchEmbeddedStatus<T>(
    node: T,
    slug: string,
    field: StatusField,
    next: object | undefined,
): T {
    if (Array.isArray(node)) {
        let changed = false;
        const mapped = node.map((child) => {
            const patched = patchEmbeddedStatus(child, slug, field, next);
            if (patched !== child) changed = true;
            return patched;
        });
        return (changed ? mapped : node) as T;
    }

    if (node === null || typeof node !== 'object') return node;
    const record = node as Record<string, unknown>;

    // A status-bearing content node: patch it if it's our target, and never
    // descend further either way (its children hold no other matching content).
    if (typeof record.slug === 'string' && Array.isArray(record[field])) {
        if (record.slug !== slug) return node;
        return { ...record, [field]: next ? [next] : [] } as T;
    }

    let changed = false;
    const out: Record<string, unknown> = {};
    for (const key in record) {
        const patched = patchEmbeddedStatus(record[key], slug, field, next);
        if (patched !== record[key]) changed = true;
        out[key] = patched;
    }
    return (changed ? out : node) as T;
}

/** Patch the embedded status of `slug` across every query whose `_id` is in `ids`. */
function patchEmbeddedStatusInQueries(
    queryClient: QueryClient,
    ids: Set<string>,
    slug: string,
    field: StatusField,
    next: object | undefined,
): void {
    queryClient.setQueriesData<unknown>(
        { predicate: (query) => ids.has(queryId(query.queryKey) ?? '') },
        (data: unknown) => patchEmbeddedStatus(data, slug, field, next),
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

/** Clear a deleted watch entry from the per-content + embedding caches, then invalidate. */
export function applyWatchDeletion(
    queryClient: QueryClient,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    // Invalidate (not remove) the per-content entry so separately-mounted
    // observers refetch → 404 → hide, rather than keep a stale entry.
    queryClient.invalidateQueries({
        queryKey: watchGetQueryKey({ path: { slug } }),
    });
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
export function applyReadDeletion(
    queryClient: QueryClient,
    content_type: ReadResponse['content']['data_type'],
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    queryClient.invalidateQueries({
        queryKey: readGetQueryKey({ path: { content_type, slug } }),
    });
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
