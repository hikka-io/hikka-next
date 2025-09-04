'use client';

import {
    ContentTypeEnum,
    ReadStatsResponse,
    ReadStatusEnum,
} from '@hikka/client';
import { useParams } from 'next/navigation';
import { createElement } from 'react';

import { CONTENT_CONFIG, READ_STATUS } from '@/utils/constants/common';

import Stats from './stats';

interface Props {
    content_type: ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;
}

const Readlist = ({ content_type }: Props) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.completed +
        data.stats.on_hold +
        data.stats.dropped +
        data.stats.planned +
        data.stats.reading;

    const stats = Object.keys(data.stats).reduce(
        (acc: Hikka.ListStat[], stat) => {
            if (!stat.includes('score')) {
                const status = READ_STATUS[stat as ReadStatusEnum];
                const percentage =
                    (100 * data.stats[stat as keyof ReadStatsResponse]) /
                    sumStats;

                acc.push({
                    percentage,
                    value: data.stats[stat as keyof ReadStatsResponse],
                    icon: status.icon && createElement(status.icon),
                    name: stat,
                });
            }

            return acc;
        },
        [],
    );

    return <Stats stats={stats} />;
};

export default Readlist;
