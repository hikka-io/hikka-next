'use client';

import { useParams } from 'next/navigation';

import Small from '@/components/typography/small';

import useAnimeInfo from '@/services/hooks/anime/use-anime-info';

import Stats from './stats';

const Score = () => {
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

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
        .reverse()
        .reduce((acc: Hikka.ListStat[], stat) => {
            if (
                stat.includes('score') &&
                data.stats[stat as API.StatType] > 0
            ) {
                const percentage =
                    (100 * data.stats[stat as API.StatType]) / sumStats;

                acc.push({
                    icon: <Small>{stat.split('score_')[1]}</Small>,
                    percentage,
                    value: data.stats[stat as API.StatType],
                });
            }

            return acc;
        }, []);

    return <Stats stats={stats} />;
};

export default Score;
