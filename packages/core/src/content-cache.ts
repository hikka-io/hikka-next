import type { QueryClient } from '@tanstack/query-core';

import {
    type ReadResponse,
    readGetQueryKey,
    type WatchResponse,
    watchGetQueryKey,
} from '@hikka/api';

import { patchEmbeddedStatus, type StatusField } from './patch-embedded';
import { type QueryId, queryId } from './query-id';

// The user's own watch list: refetched on every change so the entry reorders (sorted by
// updated-at). Its status is top-level, so the embed patcher skips it.
export const WATCH_LIST_IDS: readonly QueryId[] = ['userWatchList'];

// Every other query that embeds the user's `.watch` per content item (catalog, collections,
// character/person, franchise, favourites). Patched in place by `writeWatchToCaches` and only
// stale-marked, never refetched, so one toggle never reloads a large grid.
export const WATCH_EMBED_IDS: readonly QueryId[] = [
    'searchAnime',
    'animeSchedule',
    'animeRecommendations',
    'characterAnime',
    'personAnime',
    'contentFranchise',
    'favouriteList',
    'getCollection',
    'getCollections',
];

// Counters and the activity feed a watch write changes: stale-marked, refetched on next mount.
export const WATCH_STATS_IDS: readonly QueryId[] = [
    'userWatchStats',
    'userHistory',
];

// Same split for `.read` status.
export const READ_LIST_IDS: readonly QueryId[] = ['userReadList'];

export const READ_EMBED_IDS: readonly QueryId[] = [
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

export const READ_STATS_IDS: readonly QueryId[] = [
    'userReadStats',
    'userHistory',
];

const WATCH_EMBED_SET = new Set<string>(WATCH_EMBED_IDS);
const READ_EMBED_SET = new Set<string>(READ_EMBED_IDS);

export type InvalidateOptions = {
    /**
     * When `false`, matching queries are marked stale but not refetched immediately
     * (`refetchType: 'none'`), used by the debounced trackers to avoid flicker during rapid
     * optimistic updates. Defaults to `true`.
     */
    refetch?: boolean;
};

export function refetchTypeFor(
    options?: InvalidateOptions,
): 'none' | undefined {
    return options?.refetch === false ? 'none' : undefined;
}

/**
 * Invalidate every cached query whose generated `_id` is in `ids`, plus any query the
 * optional `extraMatch` predicate accepts (OR-combined).
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
 * Patch every query whose `_id` is in `ids`, leaving the ones the patch does not change
 * untouched: `setQueryData` would otherwise mark them fresh.
 */
export function patchQueries(
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

// An in-flight fetch of the entry would land after this write and restore the deleted entry.
export async function setQueryDataAfterCancel(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    data: unknown,
): Promise<void> {
    await queryClient.cancelQueries({ queryKey, exact: true });
    queryClient.setQueryData(queryKey, data);
}

/**
 * Reconcile every cache reflecting the user's anime watch status: refetch the user's own
 * list (it reorders and filters by status) and stale-mark the status-embedding lists and the
 * stats. The on-screen update is done by `writeWatchToCaches`; pass `{ refetch: false }` to
 * also skip the own-list refetch (debounced trackers, to avoid mid-interaction reorder).
 */
export function invalidateWatchState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, WATCH_LIST_IDS, options),
        invalidateByIds(queryClient, [...WATCH_EMBED_IDS, ...WATCH_STATS_IDS], {
            refetch: false,
        }),
    ]).then(() => undefined);
}

/** Invalidate every cache reflecting the user's manga/novel read status. */
export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, READ_LIST_IDS, options),
        invalidateByIds(queryClient, [...READ_EMBED_IDS, ...READ_STATS_IDS], {
            refetch: false,
        }),
    ]).then(() => undefined);
}

/**
 * Reflect a watch add/update in the per-content (`watchGet`) cache and in every
 * status-embedding list. Pair with `invalidateWatchState`, or call `applyWatchMutation`.
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

/** Clear a deleted watch entry from the per-content and embedding caches, then invalidate. */
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
