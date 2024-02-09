import { WATCH_STATUS } from '@/utils/constants';

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
    if (before === null && after) {
        return (
            <>
                Оцінено на <span className="font-bold">{after}</span>
            </>
        );
    }

    if (before !== null && after) {
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
    if (before === null && after) {
        return (
            <>
                Переглянуто <span className="font-bold">{after}</span> епізодів
            </>
        );
    }

    if (before !== null && after) {
        if (after - before === 1) {
            return (
                <>
                    Переглянуто <span className="font-bold">{after}</span>{' '}
                    епізод
                </>
            );
        } else if (before > after) {
            return (
                <>
                    Переглянуто <span className="font-bold">{after}</span>{' '}
                    епізодів
                </>
            );
        } else {
            return (
                <>
                    Переглянуто з <span className="font-bold">{before}</span> по{' '}
                    <span className="font-bold">{after}</span> епізоди
                </>
            );
        }
    }
};

export const convertDeleteWatch = () => {
    return (
        <>
            Видалено зі списку
        </>
    );
};

export const createWatchEvents = (history_type: Hikka.HistoryType, data?: Hikka.HistoryWatchData) => {
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

    return events;
};