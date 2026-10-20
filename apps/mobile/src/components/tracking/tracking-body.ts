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
    omitUndefined,
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
            ...(status === COMPLETED
                ? omitUndefined({
                      episodes: content?.episodes_total || undefined,
                  })
                : undefined),
        };
    }

    const read = entry as ReadResponseBase | undefined;

    return {
        status: status as ReadStatusEnum,
        ...carryOverReadArgs(read),
        ...(status === COMPLETED
            ? omitUndefined({
                  volumes: content?.volumes || read?.volumes || undefined,
                  chapters: content?.chapters || read?.chapters || undefined,
              })
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

/** Dates are UTC-midnight unix seconds on the wire and a local calendar day in the picker, as on the web. */
export const unixToLocalDate = (unix: number): Date => {
    const date = new Date(unix * 1000);
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
    );
};

export const localDateToUnix = (date: Date): number =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000;
