'use client';

import {
    AnimeStatsResponse,
    ContentTypeEnum,
    ReadStatsResponse,
} from '@hikka/client';
import { useParams } from 'next/navigation';

import Small from '@/components/typography/small';

import { CONTENT_CONFIG } from '@/utils/constants/common';

import Stats from './stats';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Score = ({ content_type }: Props) => {
    const params = useParams();
    const { data } = CONTENT_CONFIG[content_type].useInfo(String(params.slug));

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.score_1 +
        data.stats.score_2 +
        data.stats.score_3 +
        data.stats.score_4 +
        data.stats.score_5 +
        data.stats.score_6 +
        data.stats.score_7 +
        data.stats.score_8 +
        data.stats.score_9 +
        data.stats.score_10;

    const stats = Object.keys(data.stats)
        .filter((stat) => stat.includes('score'))
        .reverse()
        .reduce((acc: Hikka.ListStat[], stat) => {
            if (
                data.stats[
                    stat as keyof (AnimeStatsResponse | ReadStatsResponse)
                ] > 0
            ) {
                const percentage =
                    (100 *
                        data.stats[
                            stat as keyof (
                                | AnimeStatsResponse
                                | ReadStatsResponse
                            )
                        ]) /
                    sumStats;

                acc.push({
                    icon: <Small>{stat.split('score_')[1]}</Small>,
                    percentage,
                    value: data.stats[
                        stat as keyof (AnimeStatsResponse | ReadStatsResponse)
                    ],
                });
            }

            return acc;
        }, []);

    return <Stats stats={stats} />;
};

export default Score;
