import {
    API_LIMITS,
    ContentTypeEnum,
    type MainContentTypeEnum,
    type ReadArgs,
    type ReadResponseBase,
    ReadStatusEnum,
    type WatchArgs,
    type WatchResponseBase,
    WatchStatusEnum,
} from '@hikka/api';
import {
    carryOverReadArgs,
    carryOverWatchArgs,
    completedReadFill,
    completedWatchFill,
} from '@hikka/core';

export type TrackingKind = 'watch' | 'read';

export type ListEntry = WatchResponseBase | ReadResponseBase;

export type ProgressTotals = {
    episodes_total?: number | null;
    chapters?: number | null;
    volumes?: number | null;
};

/** Everything the edit sheet holds; every field is sent on save because the PUT is full-replace. */
export type EntryDraft = {
    status: string;
    score: number;
    episodes: number;
    chapters: number;
    volumes: number;
    repeats: number;
    note: string;
    start_date: number | null;
    end_date: number | null;
};

export const kindOf = (contentType: MainContentTypeEnum): TrackingKind =>
    contentType === ContentTypeEnum.ANIME ? 'watch' : 'read';

export const PLANNED_STATUS = {
    watch: WatchStatusEnum.PLANNED,
    read: ReadStatusEnum.PLANNED,
} as const;

const COMPLETED = 'completed';

/** A status change from a menu: the carried-over snapshot plus the COMPLETED fill, like the web. */
export function buildStatusBody(
    kind: TrackingKind,
    status: string,
    entry: ListEntry | undefined,
    content: ProgressTotals | undefined,
): WatchArgs | ReadArgs {
    if (kind === 'watch') {
        return {
            status: status as WatchStatusEnum,
            ...carryOverWatchArgs(entry as WatchResponseBase | undefined),
            ...(status === COMPLETED ? completedWatchFill(content) : undefined),
        };
    }

    const read = entry as ReadResponseBase | undefined;

    return {
        status: status as ReadStatusEnum,
        ...carryOverReadArgs(read),
        ...(status === COMPLETED
            ? completedReadFill(content, read)
            : undefined),
    };
}

export function draftFromEntry(
    kind: TrackingKind,
    entry: ListEntry | null | undefined,
): EntryDraft {
    const watch = entry as WatchResponseBase | null | undefined;
    const read = entry as ReadResponseBase | null | undefined;

    return {
        status: entry?.status ?? PLANNED_STATUS[kind],
        score: entry?.score ?? 0,
        episodes: watch?.episodes ?? 0,
        chapters: read?.chapters ?? 0,
        volumes: read?.volumes ?? 0,
        repeats: (kind === 'watch' ? watch?.rewatches : read?.rereads) ?? 0,
        note: entry?.note ?? '',
        start_date: entry?.start_date ?? null,
        end_date: entry?.end_date ?? null,
    };
}

/** The full snapshot for the sheet's save: nothing is omitted, so the full-replace PUT resets nothing. */
export function buildEditBody(
    kind: TrackingKind,
    draft: EntryDraft,
): WatchArgs | ReadArgs {
    const shared = {
        score: draft.score,
        note: draft.note.trim() || null,
        start_date: draft.start_date,
        end_date: draft.end_date,
    };

    if (kind === 'watch') {
        return {
            ...shared,
            status: draft.status as WatchStatusEnum,
            episodes: draft.episodes,
            rewatches: draft.repeats,
        };
    }

    return {
        ...shared,
        status: draft.status as ReadStatusEnum,
        chapters: draft.chapters,
        volumes: draft.volumes,
        rereads: draft.repeats,
    };
}

/** The backend rejects anime episodes above a known total; manga and novel totals are not enforced. */
export const episodesMax = (content: ProgressTotals | undefined) =>
    content?.episodes_total || API_LIMITS.listProgress.max;

export const clampInt = (value: number, min: number, max: number) =>
    Math.min(
        max,
        Math.max(min, Math.trunc(Number.isFinite(value) ? value : 0)),
    );

export type EntryResolution =
    | { state: 'resolved'; entry: ListEntry | null }
    | { state: 'loading' }
    | { state: 'error' }
    | { state: 'verify' };

type ResolveInput = {
    /** From a list response: `undefined` not supplied, `null` known untracked. */
    supplied: ListEntry | null | undefined;
    /** The per-title query's data (`null` after a 404 or a delete). */
    cached: ListEntry | null | undefined;
    /** The cached value was read or written after a disagreement was noticed. */
    cachedVerified: boolean;
    isError: boolean;
};

// Both are entries: a refetched list can carry an edit made elsewhere, a local write updates both.
const newer = (a: ListEntry, b: ListEntry) => (b.updated > a.updated ? b : a);

/**
 * Which entry a control may build a write from. The supplied entry wins, like the web's
 * `entryProp || entryQuery`. When the two sources disagree on tracked vs untracked, neither is
 * trusted until the per-title entry is re-read (`verify`): acting on a stale `null` would PUT
 * `{ status: 'planned' }` over a real entry and wipe its score, progress, note and dates.
 */
export function resolveListEntry({
    supplied,
    cached,
    cachedVerified,
    isError,
}: ResolveInput): EntryResolution {
    if (supplied === undefined) {
        if (cached !== undefined) return { state: 'resolved', entry: cached };
        return isError ? { state: 'error' } : { state: 'loading' };
    }

    if (cached === undefined) return { state: 'resolved', entry: supplied };

    if (cached && supplied) {
        return { state: 'resolved', entry: newer(cached, supplied) };
    }
    if (cached === supplied) return { state: 'resolved', entry: null };

    if (cachedVerified) return { state: 'resolved', entry: cached };
    return isError ? { state: 'error' } : { state: 'verify' };
}
