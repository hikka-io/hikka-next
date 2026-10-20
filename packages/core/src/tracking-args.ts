import type {
    ReadArgs,
    ReadResponse,
    ReadResponseBase,
    WatchArgs,
    WatchResponse,
    WatchResponseBase,
} from '@hikka/api';

export const carryOverWatchArgs = (
    watch: WatchResponse | WatchResponseBase | undefined,
): Partial<WatchArgs> =>
    watch
        ? {
              episodes: watch.episodes || undefined,
              score: watch.score || undefined,
              note: watch.note || undefined,
              rewatches: watch.rewatches || undefined,
              start_date: watch.start_date,
              end_date: watch.end_date,
          }
        : {};

export const carryOverReadArgs = (
    read: ReadResponse | ReadResponseBase | undefined,
): Partial<ReadArgs> =>
    read
        ? {
              chapters: read.chapters || undefined,
              volumes: read.volumes || undefined,
              score: read.score || undefined,
              note: read.note || undefined,
              rereads: read.rereads || undefined,
              start_date: read.start_date,
              end_date: read.end_date,
          }
        : {};

export const omitUndefined = <T extends object>(args: T): Partial<T> =>
    Object.fromEntries(
        Object.entries(args).filter(([, value]) => value !== undefined),
    ) as Partial<T>;

type WatchTotals = { episodes_total?: number | null };
type ReadTotals = { chapters?: number | null; volumes?: number | null };

/**
 * Progress filled in when a status changes to COMPLETED: the content's totals, never
 * `undefined` keys, so an unknown total cannot override the carried-over progress.
 */
export const completedWatchFill = (
    content: WatchTotals | undefined,
): Partial<WatchArgs> =>
    omitUndefined({ episodes: content?.episodes_total || undefined });

/** Read mirror of `completedWatchFill`; falls back to the entry's own progress. */
export const completedReadFill = (
    content: ReadTotals | undefined,
    entry: Pick<ReadResponseBase, 'chapters' | 'volumes'> | undefined,
): Partial<ReadArgs> =>
    omitUndefined({
        volumes: content?.volumes || entry?.volumes || undefined,
        chapters: content?.chapters || entry?.chapters || undefined,
    });
