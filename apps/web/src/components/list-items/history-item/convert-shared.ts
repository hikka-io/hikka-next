// Shared history-event formatters used by both the read and watch converters.

export const TIMES_DECLENSION: [string, string, string] = [
    'раз',
    'рази',
    'разів',
];

export const convertScore = (before: number | null, after: number | null) => {
    if (before === null && after !== null) {
        return `Оцінено на **${after}**`;
    }

    if (before !== null && after !== null) {
        if (before === after || before === 0) {
            return `Оцінено на **${after}**`;
        }

        return `Змінено оцінку з **${before}** на **${after}**`;
    }
};

export const convertStatus = (
    before: string | null,
    after: string | null,
    statusMap: Record<string, { title_ua: string }>,
) => {
    if (before === null && after) {
        return `${statusMap[after].title_ua}`;
    }

    if (before !== null && after) {
        return `Змінено на список **${statusMap[after].title_ua}**`;
    }

    if (before && after === null) {
        return 'Видалено зі списоку';
    }
};
