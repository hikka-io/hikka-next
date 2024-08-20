import { READ_STATUS } from '@/utils/constants/common';
import getDeclensionWord from '@/utils/get-declension-word';

const CHAPTERS_DECLENSION: [string, string, string] = [
    'розділ',
    'розділи',
    'розділів',
];
const VOLUMES_DECLENSION: [string, string, string] = ['том', 'томи', 'томів'];
const TIMES_DECLENSION: [string, string, string] = ['раз', 'рази', 'разів'];

export const convertStatus = (
    before: API.ReadStatus | null,
    after: API.ReadStatus | null,
) => {
    if (before === null && after) {
        return `${READ_STATUS[after].title_ua}`;
    }

    if (before !== null && after) {
        return `Змінено на список **${READ_STATUS[after].title_ua}**`;
    }

    if (before && after === null) {
        return 'Видалено зі списоку';
    }
};

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

export const convertChapters = (
    before: number | null,
    after: number | null,
) => {
    if (before === null && after !== null) {
        return `Прочитано **${after}** ${getDeclensionWord(after, CHAPTERS_DECLENSION)}`;
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return `Прочитано **${after}** ${getDeclensionWord(after, CHAPTERS_DECLENSION)}`;
        } else if (after === 0) {
            return null;
        } else if (after - before === 1 || before === 0 || before > after) {
            return `Прочитано **${after}** ${CHAPTERS_DECLENSION[0]}`;
        } else {
            return `Прочитано з **${before + 1}** по **${after}** ${CHAPTERS_DECLENSION[0]}`;
        }
    }
};

export const convertVolumes = (before: number | null, after: number | null) => {
    if (before === null && after !== null) {
        return `Прочитано **${after}** ${getDeclensionWord(after, VOLUMES_DECLENSION)}`;
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return `Прочитано **${after}** ${getDeclensionWord(after, VOLUMES_DECLENSION)}`;
        } else if (after === 0) {
            return null;
        } else if (after - before === 1 || before === 0 || before > after) {
            return `Прочитано **${after}** ${VOLUMES_DECLENSION[0]}`;
        } else {
            return `Прочитано з **${before + 1}** по **${after}** ${VOLUMES_DECLENSION[0]}`;
        }
    }
};

export const convertRereads = (before: number | null, after: number | null) => {
    if (after !== null) {
        return `Повторно прочитано **${after}** ${getDeclensionWord(after, TIMES_DECLENSION)}`;
    }
};

export const convertDeleteRead = () => {
    return 'Видалено зі списку';
};

export const createReadEvents = (
    history_type: API.HistoryType,
    data?: API.HistoryReadData,
) => {
    const events = [];

    if (
        history_type === 'read_manga_delete' ||
        history_type === 'read_novel_delete'
    ) {
        events.push(convertDeleteRead());
    }

    if (data?.before?.status || data?.after?.status) {
        events.push(convertStatus(data.before.status, data.after.status));
    }

    if (data?.before?.chapters || data?.after?.chapters) {
        events.push(convertChapters(data.before.chapters, data.after.chapters));
    }

    if (data?.before?.volumes || data?.after?.volumes) {
        events.push(convertVolumes(data.before.volumes, data.after.volumes));
    }

    if (data?.before?.score || data?.after?.score) {
        events.push(convertScore(data.before.score, data.after.score));
    }

    if (data?.before?.rereads || data?.after?.rereads) {
        events.push(convertRereads(data.before.rereads, data.after.rereads));
    }

    return events.filter((event) => event !== null);
};
