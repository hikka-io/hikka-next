import type {
    InfiniteData,
    QueryClient,
    QueryKey,
} from '@tanstack/react-query';

import {
    type FavouriteContentTypeEnum,
    type FavouriteResponse,
    getEditQueryKey,
    getFavouriteQueryKey,
    getVoteQueryKey,
    type SetVoteData,
    type UserCollectionResponse,
    type UserCollectionsListResponse,
    VoteContentTypeEnum,
    type VoteResponse,
} from '@hikka/api';
import {
    ARTICLE_IDS,
    applyCommentVote,
    COLLECTION_IDS,
    COMMENT_LIST_IDS,
    FOLLOW_EMBED_IDS,
    type InvalidateOptions,
    invalidateByIds,
    matchesPath,
    patchQueries,
    type QueryId,
    queryId,
    READ_EMBED_IDS,
    refetchTypeFor,
    setQueryDataAfterCancel,
    USER_COLLECTIONS_ID,
    WATCH_EMBED_IDS,
} from '@hikka/core';

// Watch/read, follow, notification and comment cache writers live in @hikka/core, shared with the mobile app.
export {
    applyCommentVote,
    applyFollowChange,
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
    invalidateComments,
    invalidateNotifications,
    invalidateReadState,
    invalidateSession,
    invalidateUserProfile,
    invalidateWatchState,
    writeIgnoredNotifications,
    writeReadToCaches,
    writeSessionUI,
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

const USER_CLIENT_IDS: readonly QueryId[] = ['listUserClients'];

const AUTH_TOKEN_IDS: readonly QueryId[] = ['thirdPartyAuthTokens'];

const FAVOURITE_IDS: readonly QueryId[] = ['favouriteList'];

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
    ...FOLLOW_EMBED_IDS,
];

/** After a login: refetch the on-screen per-viewer queries and stale-mark the rest. */
export function invalidateSessionDependentQueries(
    queryClient: QueryClient,
): Promise<void> {
    return invalidateByIds(queryClient, SESSION_DEPENDENT_IDS);
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
