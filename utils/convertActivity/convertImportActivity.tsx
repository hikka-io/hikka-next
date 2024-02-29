export const convertImportWatch = (imported: number) => {
    return (
        <>
            Імпортовано <span className="font-bold">{imported}</span> аніме у список
        </>
    );
};

export const createImportEvents = (data: API.HistoryImportData) => {
    const events = [];

    events.push(convertImportWatch(data.imported));

    return events;
};
