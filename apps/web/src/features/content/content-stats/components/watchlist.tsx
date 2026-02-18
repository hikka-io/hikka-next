'use client';

import { AnimeStatsResponse, WatchStatusEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { createElement } from 'react';

import { CONTENT_CONFIG, WATCH_STATUS } from '@/utils/constants/common';

import Stats from './stats';

const Watchlist = () => {
    const params = useParams();
    const { data } = CONTENT_CONFIG.anime.useInfo(String(params.slug));

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
        (acc: Hikka.ListStat[], stat) => {
            if (!stat.includes('score')) {
                const status = WATCH_STATUS[stat as WatchStatusEnum];
                const percentage =
                    (100 * data.stats[stat as keyof AnimeStatsResponse]) /
                    sumStats;

                acc.push({
                    percentage,
                    value: data.stats[stat as keyof AnimeStatsResponse],
                    icon:
                        status.icon &&
                        createElement(status.icon, {
                            className: '!size-3',
                        }),
                    name: stat,
                });
            }

            return acc;
        },
        [],
    );

    return <Stats stats={stats} />;
};

export default Watchlist;
