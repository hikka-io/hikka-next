import { WATCH_STATUS } from '@/utils/constants';
import getDeclensionWord from '@/utils/getDeclensionWord';

const EPISODES_DECLENSION: [string, string, string] = [
    'епізод',
    'епізоди',
    'епізодів',
];
const TIMES_DECLENSION: [string, string, string] = ['раз', 'рази', 'разів'];

export const convertStatus = (
    before: Hikka.WatchStatus | null,
    after: Hikka.WatchStatus | null,
) => {
    if (before === null && after) {
        return <>{WATCH_STATUS[after].title_ua}</>;
    }

    if (before !== null && after) {
        return (
            <>
                Змінено на список{' '}
                <span className="font-bold">
                    {WATCH_STATUS[after].title_ua}
                </span>
            </>
        );
    }

    if (before && after === null) {
        return <>Видалено зі списоку</>;
    }
};

export const convertScore = (before: number | null, after: number | null) => {
    if (before === null && after !== null) {
        return (
            <>
                Оцінено на <span className="font-bold">{after}</span>
            </>
        );
    }

    if (before !== null && after !== null) {
        if (before === after || before === 0) {
            return (
                <>
                    Оцінено на <span className="font-bold">{after}</span>
                </>
            );
        }

        return (
            <>
                Змінено оцінку з <span className="font-bold">{before}</span> на{' '}
                <span className="font-bold">{after}</span>
            </>
        );
    }
};

export const convertEpisodes = (
    before: number | null,
    after: number | null,
) => {
    if (before === null && after !== null) {
        return (
            <>
                Переглянуто <span className="font-bold">{after}</span>{' '}
                {getDeclensionWord(after, EPISODES_DECLENSION)}
            </>
        );
    }

    if (before !== null && after !== null) {
        if (before === after) {
            return (
                <>
                    Переглянуто <span className="font-bold">{after}</span>{' '}
                    {getDeclensionWord(after, EPISODES_DECLENSION)}
                </>
            );
        } else if (after - before === 1 || before === 0 || before > after) {
            return (
                <>
                    Переглянуто <span className="font-bold">{after}</span>{' '}
                    {EPISODES_DECLENSION[0]}
                </>
            );
        } else {
            return (
                <>
                    Переглянуто з{' '}
                    <span className="font-bold">{before + 1}</span> по{' '}
                    <span className="font-bold">{after}</span>{' '}
                    {EPISODES_DECLENSION[0]}
                </>
            );
        }
    }
};

export const convertRewatches = (
    before: number | null,
    after: number | null,
) => {
    if (after !== null) {
        return (
            <>
                Повторно переглянуто <span className="font-bold">{after}</span>{' '}
                {getDeclensionWord(after, TIMES_DECLENSION)}
            </>
        );
    }
};

export const convertDeleteWatch = () => {
    return <>Видалено зі списку</>;
};

export const createWatchEvents = (
    history_type: Hikka.HistoryType,
    data?: Hikka.HistoryWatchData,
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

    return events;
};
