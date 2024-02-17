export const convertImportWatch = (imported: number) => {
    return (
        <>
            Імпортовано <span className="font-bold">{imported}</span> аніме у список
        </>
    );
};

export const createImportEvents = (data: Hikka.HistoryImportData) => {
    const events = [];

    events.push(convertImportWatch(data.imported));

    return events;
};
