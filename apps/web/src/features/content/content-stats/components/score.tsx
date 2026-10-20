import { useQuery } from '@tanstack/react-query';

import type { MainContentTypeEnum } from '@hikka/api';
import { contentScoreStats } from '@hikka/core';

import { contentInfoOptions } from '@/utils/api/content-queries';
import { useParams } from '@/utils/navigation';

import type { ListStat } from '../types';
import Stats from './stats';

type Props = {
    content_type: MainContentTypeEnum;
};

const Score = ({ content_type }: Props) => {
    const params = useParams();
    const { data } = useQuery(
        contentInfoOptions(content_type, String(params.slug)),
    );

    if (!data) {
        return null;
    }

    const stats: ListStat[] = contentScoreStats(data.stats).map(
        ({ key, count, percentage }) => ({
            icon: <small>{key}</small>,
            percentage,
            value: count,
        }),
    );

    return <Stats stats={stats} />;
};

export default Score;
