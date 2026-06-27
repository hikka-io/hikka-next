import type { QueryClient } from '@tanstack/react-query';

/**
 * Generated query-key `_id`s whose responses embed the current user's `watch`
 * status on each content item (`AnimeResponseWithWatch.watch`, etc.). Content
 * cards render their status from this embedded field, so a watch mutation must
 * invalidate these — not just `watchGet` — for the cards to refresh.
 */
const WATCH_BEARING_IDS = new Set<string>([
    'userWatchList', // the user's own watch list
    'searchAnime', // catalog + ongoings + search
    'animeRecommendations',
    'characterAnime', // CharacterAnimeResponse.anime
    'personAnime', // PersonAnimeResponse.anime
    'contentFranchise', // FranchiseResponse.anime[]
    'favouriteList', // FavouriteAnimeResponse.watch
]);

/** Same idea for `read` status (`MangaResponseWithRead.read`, etc.). */
const READ_BEARING_IDS = new Set<string>([
    'userReadList',
    'searchManga',
    'searchNovel',
    'characterManga',
    'characterNovel',
    'personManga',
    'personNovel',
    'contentFranchise', // FranchiseResponse.manga[] / .novel[]
    'favouriteList', // FavouriteManga/NovelResponse.read
]);

function queryId(queryKey: readonly unknown[]): string | undefined {
    return (queryKey[0] as { _id?: string } | undefined)?._id;
}

type InvalidateOptions = {
    /**
     * When `false`, matching queries are marked stale but not refetched
     * immediately (`refetchType: 'none'`) — used by the debounced trackers to
     * avoid flicker during rapid optimistic updates. Defaults to `true`.
     */
    refetch?: boolean;
};

/**
 * Invalidate every cache reflecting the user's anime watch status: their own
 * list plus all content-list queries that embed `.watch` per item. Active
 * queries refetch immediately; inactive ones refetch on next view.
 */
export function invalidateWatchState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            return id !== undefined && WATCH_BEARING_IDS.has(id);
        },
        refetchType: options?.refetch === false ? 'none' : undefined,
    });
}

/** Invalidate every cache reflecting the user's manga/novel read status. */
export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return queryClient.invalidateQueries({
        predicate: (query) => {
            const id = queryId(query.queryKey);
            return id !== undefined && READ_BEARING_IDS.has(id);
        },
        refetchType: options?.refetch === false ? 'none' : undefined,
    });
}
