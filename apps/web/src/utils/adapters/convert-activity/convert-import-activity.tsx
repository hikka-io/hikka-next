export const convertImportWatch = (data: API.HistoryWatchImportData) => {
    return `Імпортовано **${data.imported}** аніме у список`;
};

export const convertImportRead = (data: API.HistoryReadImportData) => {
    return `Імпортовано **${data.imported_manga}** манґи та **${data.imported_novel}** ранобе у список`;
};

export const createImportEvents = (
    history_type: API.HistoryType,
    data: API.HistoryWatchImportData | API.HistoryReadImportData,
) => {
    const events = [];

    if (history_type === 'watch_import') {
        events.push(convertImportWatch(data as API.HistoryWatchImportData));
    }

    if (history_type === 'read_import') {
        events.push(convertImportRead(data as API.HistoryReadImportData));
    }

    return events;
};
