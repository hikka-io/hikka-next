'use client';

import { useParams } from 'next/navigation';
import { createElement } from 'react';

import useNovelInfo from '../../../../services/hooks/novel/use-novel-info';
import { READ_STATUS } from '../../../../utils/constants/common';
import Stats from './stats';

const Readlist = () => {
    const params = useParams();
    const { data } = useNovelInfo({ slug: String(params.slug) });

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
                const status = READ_STATUS[stat as API.ReadStatus];
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

export default Readlist;
