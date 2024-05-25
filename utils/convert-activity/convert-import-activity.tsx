export const convertImportWatch = (imported: number) => {
    return `Імпортовано **${imported}** аніме у список`;
};

export const createImportEvents = (data: API.HistoryImportData) => {
    const events = [];

    events.push(convertImportWatch(data.imported));

    return events;
};
