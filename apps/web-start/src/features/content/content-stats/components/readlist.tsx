import { createElement } from 'react';

import type {
    AppSchemasReadStatsResponse as ReadStatsResponse,
    ReadStatusEnum,
} from '@hikka/api';

import { CONTENT_CONFIG, READ_STATUS } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import Stats from './stats';

type Props = {
    content_type: 'manga' | 'novel';
};

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

    const stats: Hikka.ListStat[] = Object.keys(data.stats)
        .filter((stat) => !stat.includes('score'))
        .map((stat) => {
            const status = READ_STATUS[stat as ReadStatusEnum];
            const percentage =
                (100 * data.stats[stat as keyof ReadStatsResponse]) / sumStats;

            return {
                percentage,
                value: data.stats[stat as keyof ReadStatsResponse],
                icon: status.icon && createElement(status.icon),
                name: stat,
            };
        });

    return <Stats stats={stats} />;
};

export default Readlist;
