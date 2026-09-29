import { createElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    type AnimeStatsResponse,
    ContentTypeEnum,
    type WatchStatusEnum,
} from '@hikka/api';

import { WATCH_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import type { ListStat } from '../types';
import Stats from './stats';

const WatchStatusStats = () => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(ContentTypeEnum.ANIME, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    const sumStats =
        (data.stats.completed ?? 0) +
        (data.stats.on_hold ?? 0) +
        (data.stats.dropped ?? 0) +
        (data.stats.planned ?? 0) +
        (data.stats.watching ?? 0);

    const stats: ListStat[] = Object.keys(data.stats)
        .filter((stat) => !stat.includes('score'))
        .map((stat) => {
            const percentage =
                (100 * (data.stats[stat as keyof AnimeStatsResponse] ?? 0)) /
                sumStats;

            return {
                percentage,
                value: data.stats[stat as keyof AnimeStatsResponse] ?? 0,
                icon: createElement(
                    WATCH_STATUS_ICONS[stat as WatchStatusEnum],
                    {
                        className: 'size-3!',
                    },
                ),
                name: stat,
            };
        });

    return <Stats stats={stats} />;
};

export default WatchStatusStats;
