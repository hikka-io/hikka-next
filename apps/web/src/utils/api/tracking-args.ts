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
        ? ({
              episodes: watch.episodes || undefined,
              score: watch.score || undefined,
              note: watch.note || undefined,
              rewatches: watch.rewatches || undefined,
              start_date: watch.start_date,
              end_date: watch.end_date,
          } as unknown as Partial<WatchArgs>)
        : {};

export const carryOverReadArgs = (
    read: ReadResponse | ReadResponseBase | undefined,
): Partial<ReadArgs> =>
    read
        ? ({
              chapters: read.chapters || undefined,
              volumes: read.volumes || undefined,
              score: read.score || undefined,
              note: read.note || undefined,
              rereads: read.rereads || undefined,
              start_date: read.start_date,
              end_date: read.end_date,
          } as unknown as Partial<ReadArgs>)
        : {};
