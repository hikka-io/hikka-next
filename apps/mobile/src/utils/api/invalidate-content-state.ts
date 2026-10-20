import type { QueryClient } from '@tanstack/react-query';

import {
    type ReadResponse,
    readGetQueryKey,
    type WatchResponse,
    watchGetQueryKey,
} from '@hikka/api';
import {
    patchEmbeddedStatus,
    type QueryId,
    queryId,
    type StatusField,
} from '@hikka/core';

// The cache writers and invalidators: components never call setQueryData/invalidateQueries
// themselves. Same id lists and semantics as the web's utils/api/invalidate-content-state.ts.

// The user's own list: refetched on every change so the entry reorders (sorted by updated-at).
const WATCH_LIST_IDS: readonly QueryId[] = ['userWatchList'];

// Every other query that embeds the viewer's `.watch` per item: patched in place and only
// stale-marked, so one status change never reloads a long list.
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

const WATCH_EMBED_SET = new Set(WATCH_EMBED_IDS);
const READ_EMBED_SET = new Set(READ_EMBED_IDS);

type InvalidateOptions = {
    /** `false` marks the queries stale without refetching them now. Defaults to `true`. */
    refetch?: boolean;
};

const refetchTypeFor = (options?: InvalidateOptions) =>
    options?.refetch === false ? 'none' : undefined;

function invalidateByIds(
    queryClient: QueryClient,
    ids: readonly string[],
    options?: InvalidateOptions,
): Promise<void> {
    const idSet = new Set(ids);
    return queryClient.invalidateQueries({
        predicate: (query) => idSet.has(queryId(query.queryKey) ?? ''),
        refetchType: refetchTypeFor(options),
    });
}

// Leaves the queries the patch does not change untouched: setQueryData would mark them fresh.
function patchEmbeddedStatusInQueries(
    queryClient: QueryClient,
    ids: ReadonlySet<string>,
    slug: string,
    field: StatusField,
    next: object | undefined,
): void {
    queryClient.setQueriesData<unknown>(
        { predicate: (query) => ids.has(queryId(query.queryKey) ?? '') },
        (data: unknown) => {
            const patched = patchEmbeddedStatus(data, slug, field, next);
            return patched === data ? undefined : patched;
        },
    );
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

export function invalidateWatchState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, WATCH_LIST_IDS, options),
        invalidateByIds(queryClient, WATCH_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

export function invalidateReadState(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        invalidateByIds(queryClient, READ_LIST_IDS, options),
        invalidateByIds(queryClient, READ_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/** Store a saved watch entry in the per-title cache and in every list that embeds it. */
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

/** `writeWatchToCaches` + `invalidateWatchState`: the standard watch onSuccess. */
export function applyWatchMutation(
    queryClient: QueryClient,
    data: WatchResponse,
    options?: InvalidateOptions,
): Promise<void> {
    writeWatchToCaches(queryClient, data);
    return invalidateWatchState(queryClient, options);
}

/** Clear a deleted watch entry from the per-title and embedding caches, then invalidate. */
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

export function applyReadMutation(
    queryClient: QueryClient,
    data: ReadResponse,
    options?: InvalidateOptions,
): Promise<void> {
    writeReadToCaches(queryClient, data);
    return invalidateReadState(queryClient, options);
}

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
