import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';

import { getDeclensionWord, type WordForms } from '@/utils/i18n/declension';

import {
    convertListEntry,
    type ListEntryContext,
    type ListEntryData,
} from './convert-list-entry';
import {
    capitalizeFirst,
    fact,
    joinFacts,
    status,
    value,
} from './fact-builder';
import type { HistoryEntry, HistoryFact, HistoryMedium } from './types';

// @hikka/api types `HistoryResponse.data` as `{ [key]: unknown }`; these mirror the backend payloads.
type WatchImportData = { imported?: number; overwrite?: boolean };
type ReadImportData = {
    imported_manga?: number;
    imported_novel?: number;
    overwrite?: boolean;
};

const MANGA_FORMS = ['манґу', 'манґи', 'манґ'] as const satisfies WordForms;
const NOVEL_FORMS = ['ранобе', 'ранобе', 'ранобе'] as const satisfies WordForms;

const WATCH_TYPES: HistoryTypeEnum[] = [
    HistoryTypeEnum.WATCH,
    HistoryTypeEnum.WATCH_DELETE,
    HistoryTypeEnum.WATCH_IMPORT,
    HistoryTypeEnum.FAVOURITE_ANIME_ADD,
    HistoryTypeEnum.FAVOURITE_ANIME_REMOVE,
];

const getHistoryMedium = (type: HistoryTypeEnum): HistoryMedium =>
    WATCH_TYPES.includes(type) ? 'watch' : 'read';

const getTotals = (
    content: HistoryResponse['content'],
): ListEntryContext['totals'] => {
    if (!content) return {};
    if (content.data_type === 'anime') {
        return { episodes: content.episodes_total };
    }

    return { chapters: content.chapters, volumes: content.volumes };
};

function convertImport(
    type: HistoryTypeEnum,
    data: WatchImportData & ReadImportData,
): HistoryFact[] {
    const overwrite = data.overwrite ? [fact`наявні записи замінено`] : [];

    if (type === HistoryTypeEnum.WATCH_IMPORT) {
        return [
            fact`додано ${value(data.imported ?? 0)} аніме до списку`,
            ...overwrite,
        ];
    }

    const counts = [
        [data.imported_manga ?? 0, MANGA_FORMS],
        [data.imported_novel ?? 0, NOVEL_FORMS],
    ] as const;
    const imported = counts.filter(([count]) => count > 0);
    const parts = (imported.length ? imported : counts).map(
        ([count, forms]) =>
            fact`${value(count)} ${getDeclensionWord(count, forms)}`,
    );

    return [fact`додано ${joinFacts(parts, ' та ')}`, ...overwrite];
}

function convertEntry(
    history: HistoryResponse,
    timeZone?: string,
): Omit<HistoryEntry, 'medium'> {
    const type = history.history_type;

    switch (type) {
        case HistoryTypeEnum.WATCH_DELETE:
        case HistoryTypeEnum.READ_MANGA_DELETE:
        case HistoryTypeEnum.READ_NOVEL_DELETE:
            return {
                icon: { kind: 'delete' },
                facts: [fact`видалено зі списку`],
            };
        case HistoryTypeEnum.WATCH:
        case HistoryTypeEnum.READ_MANGA:
        case HistoryTypeEnum.READ_NOVEL:
            return convertListEntry(
                getHistoryMedium(type),
                history.data as ListEntryData,
                {
                    totals: getTotals(history.content),
                    recordedAt: [history.created, history.updated],
                    timeZone,
                },
            );
        case HistoryTypeEnum.WATCH_IMPORT:
        case HistoryTypeEnum.READ_IMPORT:
            return {
                icon: { kind: 'import' },
                facts: convertImport(
                    type,
                    history.data as WatchImportData & ReadImportData,
                ),
            };
        case HistoryTypeEnum.FAVOURITE_ANIME_ADD:
        case HistoryTypeEnum.FAVOURITE_MANGA_ADD:
        case HistoryTypeEnum.FAVOURITE_NOVEL_ADD:
            return {
                icon: { kind: 'favourite-add' },
                facts: [fact`додано в ${status('Улюблене')}`],
            };
        case HistoryTypeEnum.FAVOURITE_ANIME_REMOVE:
        case HistoryTypeEnum.FAVOURITE_MANGA_REMOVE:
        case HistoryTypeEnum.FAVOURITE_NOVEL_REMOVE:
            return {
                icon: { kind: 'favourite-remove' },
                facts: [fact`прибрано з улюбленого`],
            };
        default:
            return { icon: { kind: 'updated' }, facts: [fact`запис оновлено`] };
    }
}

export function convertHistory(
    history: HistoryResponse,
    timeZone?: string,
): HistoryEntry {
    const { icon, facts } = convertEntry(history, timeZone);

    return {
        medium: getHistoryMedium(history.history_type),
        icon,
        facts: capitalizeFirst(facts),
    };
}
