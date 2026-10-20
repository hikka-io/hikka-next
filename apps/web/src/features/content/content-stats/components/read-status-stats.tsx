import { createElement } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { ReadStatusEnum } from '@hikka/api';
import { contentStatusStats } from '@hikka/core';

import { READ_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import type { ListStat } from '../types';
import Stats from './stats';

type Props = {
    content_type: 'manga' | 'novel';
};

const ReadStatusStats = ({ content_type }: Props) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    const stats: ListStat[] = contentStatusStats(data.stats, content_type).map(
        ({ key, count, percentage }) => ({
            percentage,
            value: count,
            icon: createElement(READ_STATUS_ICONS[key as ReadStatusEnum]),
            name: key,
        }),
    );

    return <Stats stats={stats} />;
};

export default ReadStatusStats;
