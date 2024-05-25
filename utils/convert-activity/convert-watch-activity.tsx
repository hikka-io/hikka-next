import { WATCH_STATUS } from '@/utils/constants';
import getDeclensionWord from '@/utils/get-declension-word';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];
const TIMES_DECLENSION: [string, string, string] = ['раз', 'рази', 'разів'];

export const convertStatus = (
    before: API.WatchStatus | null,
    after: API.WatchStatus | null,
) => {
    if (before === null && after) {
        return `${WATCH_STATUS[after].title_ua}`;
    }

    if (before !== null && after) {
        return `Змінено на список **${WATCH_STATUS[after].title_ua}**`;
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

export const convertEpisodes = (
    before: number | null,
    after: number | null,
) => {
    if (before === null && after !== null) {
        return `Переглянуто **${after}** ${getDeclensionWord(after, EPISODES_DECLENSION)}`;
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return `Переглянуто **${after}** ${getDeclensionWord(after, EPISODES_DECLENSION)}`;
        } else if (after === 0) {
            return null;
        } else if (after - before === 1 || before === 0 || before > after) {
            return `Переглянуто **${after}** ${EPISODES_DECLENSION[0]}`;
        } else {
            return `Переглянуто з **${before + 1}** по **${after}** ${EPISODES_DECLENSION[0]}`;
        }
    }
};

export const convertRewatches = (
    before: number | null,
    after: number | null,
) => {
    if (after !== null) {
        return `Повторно переглянуто **${after}** ${getDeclensionWord(after, TIMES_DECLENSION)}`;
    }
};

export const convertDeleteWatch = () => {
    return 'Видалено зі списку';
};

export const createWatchEvents = (
    history_type: API.HistoryType,
    data?: API.HistoryWatchData,
) => {
    const events = [];

    if (history_type === 'watch_delete') {
        events.push(convertDeleteWatch());
    }

    if (data?.before?.status || data?.after?.status) {
        events.push(convertStatus(data.before.status, data.after.status));
    }

    if (data?.before?.episodes || data?.after?.episodes) {
        events.push(convertEpisodes(data.before.episodes, data.after.episodes));
    }

    if (data?.before?.score || data?.after?.score) {
        events.push(convertScore(data.before.score, data.after.score));
    }

    if (data?.before?.rewatches || data?.after?.rewatches) {
        events.push(
            convertRewatches(data.before.rewatches, data.after.rewatches),
        );
    }

    return events.filter((event) => event !== null);
};
