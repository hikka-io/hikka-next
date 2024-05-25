'use client';

import { useParams } from 'next/navigation';
import { createElement } from 'react';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';
import { WATCH_STATUS } from '@/utils/constants';

import Stats from './stats';

const Watchlist = () => {
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.completed +
        data.stats.on_hold +
        data.stats.dropped +
        data.stats.planned +
        data.stats.watching;

    const stats = Object.keys(data.stats).reduce(
        (acc: Hikka.WatchStat[], stat) => {
            if (!stat.includes('score')) {
                const status = WATCH_STATUS[stat as API.WatchStatus];
                const percentage =
                    (100 * data.stats[stat as API.StatType]) / sumStats;

                acc.push({
                    percentage,
                    value: data.stats[stat as API.StatType],
                    icon: status.icon && createElement(status.icon),
                    color: status.color!,
                });
            }

            return acc;
        },
        [],
    );

    return <Stats stats={stats} />;
};

export default Watchlist;
