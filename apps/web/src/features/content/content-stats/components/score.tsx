import { useQuery } from '@tanstack/react-query';

import type {
    AnimeStatsResponse,
    MainContentTypeEnum,
    AppSchemasReadStatsResponse as ReadStatsResponse,
} from '@hikka/api';

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

    const sumStats =
        (data.stats.score_1 ?? 0) +
        (data.stats.score_2 ?? 0) +
        (data.stats.score_3 ?? 0) +
        (data.stats.score_4 ?? 0) +
        (data.stats.score_5 ?? 0) +
        (data.stats.score_6 ?? 0) +
        (data.stats.score_7 ?? 0) +
        (data.stats.score_8 ?? 0) +
        (data.stats.score_9 ?? 0) +
        (data.stats.score_10 ?? 0);

    const stats: ListStat[] = Object.keys(data.stats)
        .filter(
            (stat) =>
                stat.includes('score') &&
                (data.stats[
                    stat as keyof (AnimeStatsResponse | ReadStatsResponse)
                ] ?? 0) > 0,
        )
        .reverse()
        .map((stat) => {
            const percentage =
                (100 *
                    (data.stats[
                        stat as keyof (AnimeStatsResponse | ReadStatsResponse)
                    ] ?? 0)) /
                sumStats;

            return {
                icon: <small>{stat.split('score_')[1]}</small>,
                percentage,
                value:
                    data.stats[
                        stat as keyof (AnimeStatsResponse | ReadStatsResponse)
                    ] ?? 0,
            };
        });

    return <Stats stats={stats} />;
};

export default Score;
