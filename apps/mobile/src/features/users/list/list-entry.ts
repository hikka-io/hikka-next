import type { ReadResponse, WatchResponse } from '@hikka/api';
import { getDeclensionWord, REREAD_FORMS, VIEW_FORMS } from '@hikka/core';

import type { UserListEntry } from '../queries';

const isWatch = (entry: UserListEntry): entry is WatchResponse =>
    'anime' in entry;

export const entryContent = (entry: UserListEntry) =>
    isWatch(entry) ? entry.anime : (entry as ReadResponse).content;

const progress = (value: number, total?: number | null) =>
    `${value} / ${total || '?'}`;

/** The web table's progress columns as one line. */
export const entryProgress = (entry: UserListEntry) => {
    if (isWatch(entry)) {
        return `Епізоди: ${progress(entry.episodes, entry.anime.episodes_total)}`;
    }

    const read = entry as ReadResponse;

    return `Розділи: ${progress(read.chapters, read.content.chapters)} · Томи: ${progress(read.volumes, read.content.volumes)}`;
};

/** "2 перегляди" for a title watched twice; nothing for a single pass. */
export const entryRepeats = (entry: UserListEntry) => {
    const repeats = isWatch(entry)
        ? entry.rewatches
        : (entry as ReadResponse).rereads;

    if (repeats <= 0) return null;

    return `${repeats + 1} ${getDeclensionWord(repeats + 1, isWatch(entry) ? VIEW_FORMS : REREAD_FORMS)}`;
};
