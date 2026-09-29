import { createElement } from 'react';

import type {
    AppSchemasReadStatsResponse as ReadStatsResponse,
    ReadStatusEnum,
} from '@hikka/api';

import { READ_STATUS_ICONS } from '@/components/icons/list-status-icons';
import { useParams } from '@/utils/navigation';

import { CONTENT_CONFIG } from '../../content-config';
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
        (data.stats.completed ?? 0) +
        (data.stats.on_hold ?? 0) +
        (data.stats.dropped ?? 0) +
        (data.stats.planned ?? 0) +
        (data.stats.reading ?? 0);

    const stats: Hikka.ListStat[] = Object.keys(data.stats)
        .filter((stat) => !stat.includes('score'))
        .map((stat) => {
            const percentage =
                (100 * (data.stats[stat as keyof ReadStatsResponse] ?? 0)) /
                sumStats;

            return {
                percentage,
                value: data.stats[stat as keyof ReadStatsResponse] ?? 0,
                icon: createElement(READ_STATUS_ICONS[stat as ReadStatusEnum]),
                name: stat,
            };
        });

    return <Stats stats={stats} />;
};

export default Readlist;
