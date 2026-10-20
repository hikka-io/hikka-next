import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';
import {
    CHAPTER_FORMS,
    EPISODE_FORMS,
    getDeclensionWord,
    LIST_STATUS,
    VOLUME_FORMS,
} from '@hikka/core';

type EntryState = {
    status?: string | null;
    score?: number | null;
    episodes?: number | null;
    chapters?: number | null;
    volumes?: number | null;
};

type EntryData = { before?: EntryState | null; after?: EntryState | null };

const STATUS_LABELS = {
    ...LIST_STATUS.watch,
    ...LIST_STATUS.read,
} as Record<string, { title_ua: string }>;

const UNITS = [
    ['episodes', EPISODE_FORMS],
    ['chapters', CHAPTER_FORMS],
    ['volumes', VOLUME_FORMS],
] as const;

const FAVOURITE_ADD: string[] = [
    HistoryTypeEnum.FAVOURITE_ANIME_ADD,
    HistoryTypeEnum.FAVOURITE_MANGA_ADD,
    HistoryTypeEnum.FAVOURITE_NOVEL_ADD,
];
const FAVOURITE_REMOVE: string[] = [
    HistoryTypeEnum.FAVOURITE_ANIME_REMOVE,
    HistoryTypeEnum.FAVOURITE_MANGA_REMOVE,
    HistoryTypeEnum.FAVOURITE_NOVEL_REMOVE,
];
const DELETED: string[] = [
    HistoryTypeEnum.WATCH_DELETE,
    HistoryTypeEnum.READ_MANGA_DELETE,
    HistoryTypeEnum.READ_NOVEL_DELETE,
];
export const IMPORTS: string[] = [
    HistoryTypeEnum.WATCH_IMPORT,
    HistoryTypeEnum.READ_IMPORT,
];

export const historyImportTitle = (type: string) =>
    type === HistoryTypeEnum.WATCH_IMPORT
        ? 'Імпорт аніме'
        : 'Імпорт манґи та ранобе';

function describeEntry(data: EntryData) {
    const before = data.before ?? {};
    const after = data.after ?? {};
    const parts: string[] = [];

    if (after.status && after.status !== before.status) {
        parts.push(STATUS_LABELS[after.status]?.title_ua ?? after.status);
    }

    for (const [unit, forms] of UNITS) {
        const next = after[unit] ?? 0;

        if (next > 0 && next !== (before[unit] ?? 0)) {
            parts.push(`${next} ${getDeclensionWord(next, forms)}`);
        }
    }

    if (after.score && after.score !== before.score) {
        parts.push(`оцінка ${after.score}`);
    }

    return parts;
}

// A compact one-line stand-in for the web's fact timeline; the full conversion belongs to the history page (phase 3).
export function summarizeHistory(history: HistoryResponse): string {
    const type = history.history_type;

    if (DELETED.includes(type)) return 'Видалено зі списку';
    if (FAVOURITE_ADD.includes(type)) return 'Додано в улюблене';
    if (FAVOURITE_REMOVE.includes(type)) return 'Прибрано з улюбленого';
    if (IMPORTS.includes(type)) return 'Імпортовано список';

    const parts = describeEntry(history.data as EntryData);

    if (parts.length === 0) return 'Запис оновлено';

    const text = parts.join(' · ');

    return text.charAt(0).toUpperCase() + text.slice(1);
}
