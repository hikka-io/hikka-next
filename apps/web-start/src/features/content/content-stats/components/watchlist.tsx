'use client';

import { createElement } from 'react';

import type { AnimeStatsResponse, WatchStatusEnum } from '@hikka/client';

import { CONTENT_CONFIG, WATCH_STATUS } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

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

    const stats: Hikka.ListStat[] = Object.keys(data.stats)
        .filter((stat) => !stat.includes('score'))
        .map((stat) => {
            const status = WATCH_STATUS[stat as WatchStatusEnum];
            const percentage =
                (100 * data.stats[stat as keyof AnimeStatsResponse]) / sumStats;

            return {
                percentage,
                value: data.stats[stat as keyof AnimeStatsResponse],
                icon:
                    status.icon &&
                    createElement(status.icon, {
                        className: 'size-3!',
                    }),
                name: stat,
            };
        });

    return <Stats stats={stats} />;
};

export default Watchlist;
