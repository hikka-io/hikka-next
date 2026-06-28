import type { QueryClient } from '@tanstack/react-query';

/**
 * Generated query-key `_id`s whose responses embed the current user's `watch`
 * status on each content item (`AnimeResponseWithWatch.watch`, etc.). Content
 * cards render their status from this embedded field, so a watch mutation must
 * invalidate these — not just `watchGet` — for the cards to refresh.
 */
const WATCH_BEARING_IDS = [
    'userWatchList', // the user's own watch list
    'searchAnime', // catalog + ongoings + search
    'animeRecommendations',
    'characterAnime', // CharacterAnimeResponse.anime
    'personAnime', // PersonAnimeResponse.anime
    'contentFranchise', // FranchiseResponse.anime[]
    'favouriteList', // FavouriteAnimeResponse.watch
];

/** Same idea for `read` status (`MangaResponseWithRead.read`, etc.). */
const READ_BEARING_IDS = [
    'userReadList',
    'searchManga',
    'searchNovel',
    'characterManga',
    'characterNovel',
    'personManga',
    'personNovel',
    'contentFranchise', // FranchiseResponse.manga[] / .novel[]
    'favouriteList', // FavouriteManga/NovelResponse.read
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
    'followingHistory', // the personalised feed
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

/**
 * Invalidate every cached query whose generated `_id` is in `ids`. This is the
 * shared replacement for the old `@hikka/react` `createMutation`
 * `invalidateQueries` mechanism — call it (or one of the named helpers below)
 * from a mutation `onSuccess` instead of hand-rolling a `predicate`.
 */
export function invalidateByIds(
    queryClient: QueryClient,
    ids: readonly string[],
    options?: InvalidateOptions,
): Promise<void> {
    const idSet = new Set(ids);
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            return id !== undefined && idSet.has(id);
        },
        refetchType: options?.refetch === false ? 'none' : undefined,
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
    return invalidateByIds(queryClient, WATCH_BEARING_IDS, options);
}

/** Invalidate every cache reflecting the user's manga/novel read status. */
export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, READ_BEARING_IDS, options);
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
    const idSet = new Set([...FOLLOW_IDS, ...ARTICLE_IDS, ...COLLECTION_IDS]);
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            if (id === undefined) return false;
            if (idSet.has(id)) return true;
            return (
                id === 'userProfile' &&
                JSON.stringify(query.queryKey).includes(targetUsername)
            );
        },
        refetchType: options?.refetch === false ? 'none' : undefined,
    });
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
        refetchType: options?.refetch === false ? 'none' : undefined,
    });
}
