import { createElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ContentTypeEnum, type WatchStatusEnum } from '@hikka/api';
import { contentStatusStats } from '@hikka/core';

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

    const stats: ListStat[] = contentStatusStats(
        data.stats,
        ContentTypeEnum.ANIME,
    ).map(({ key, count, percentage }) => ({
        percentage,
        value: count,
        icon: createElement(WATCH_STATUS_ICONS[key as WatchStatusEnum], {
            className: 'size-3!',
        }),
        name: key,
    }));

    return <Stats stats={stats} />;
};

export default WatchStatusStats;
