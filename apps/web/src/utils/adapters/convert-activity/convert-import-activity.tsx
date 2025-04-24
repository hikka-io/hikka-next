import {
    HistoryReadImportData,
    HistoryTypeEnum,
    HistoryWatchImportData,
} from '@hikka/client';

export const convertImportWatch = (data: HistoryWatchImportData) => {
    return `Імпортовано **${data.imported}** аніме у список`;
};

export const convertImportRead = (data: HistoryReadImportData) => {
    return `Імпортовано **${data.imported_manga}** манґи та **${data.imported_novel}** ранобе у список`;
};

export const createImportEvents = (
    history_type: HistoryTypeEnum,
    data: HistoryWatchImportData | HistoryReadImportData,
) => {
    const events: string[] = [];

    if (history_type === HistoryTypeEnum.WATCH_IMPORT) {
        events.push(convertImportWatch(data as HistoryWatchImportData));
    }

    if (history_type === HistoryTypeEnum.READ_IMPORT) {
        events.push(convertImportRead(data as HistoryReadImportData));
    }

    return events;
};
