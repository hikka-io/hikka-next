import { Metadata } from 'next';
import { FC } from 'react';

import {
    YearBingeHighlights,
    YearCompletedTimeline,
    YearGenreRadar,
    YearHero,
    YearMonthlyActivity,
    YearStatusDistribution,
    YearTopAnime,
    YearTopManga,
    YearTopNovel,
} from '@/features/users/year-statistics';

import { YearData } from '@/types/year-statistics';

import yearData from '../../../../../../../../year_data.json';

interface Props {
    params: Promise<{
        username: string;
        year: string;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { username, year } = params;

    return {
        title: `Підсумок ${year} року`,
        description: `Річна статистика користувача ${username} за ${year} рік`,
    };
}

const YearStatisticsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { username, year } = params;

    const data = (yearData as YearData)[username];

    if (!data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-muted-foreground">
                    Статистика для користувача не знайдена
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-16">
            <YearHero data={data} year={year} username={username} />
            <div className="flex flex-col gap-16 container max-w-3xl p-0 isolate">
                <div className="flex flex-col gap-8 ">
                    <YearTopAnime data={data} />
                    <YearTopManga data={data} />
                    <YearTopNovel data={data} />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <YearGenreRadar data={data} />
                        <YearStatusDistribution data={data} />
                    </div>
                    <YearMonthlyActivity data={data} />
                    <YearBingeHighlights data={data} />
                </div>

                <YearCompletedTimeline data={data} />
            </div>
        </div>
    );
};

export default YearStatisticsPage;
