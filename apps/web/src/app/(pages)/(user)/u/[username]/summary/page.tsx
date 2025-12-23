import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchArtifact } from '@hikka/react/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import {
    PrivacySetting,
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

import { YearStatistics } from '@/types/year-statistics';
import { getHikkaClientConfig } from '@/utils/hikka-client';

interface Props {
    params: Promise<{
        username: string;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { username } = params;

    return {
        title: `Підсумки 2025 року`,
        description: `Річна статистика користувача ${username} за 2025 рік`,
    };
}

const YearStatisticsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { username } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const artifact = await prefetchArtifact<YearStatistics>({
        username,
        name: 'year-summary-2025',
        queryClient,
        clientConfig,
    });

    if (!artifact) {
        return redirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <PrivacySetting />

                <YearHero data={artifact.data} username={username} />

                <div className="flex flex-col gap-8 container max-w-3xl p-0 isolate">
                    <div className="flex flex-col gap-8">
                        <YearTopAnime data={artifact.data} />
                        <YearTopManga data={artifact.data} />
                        <YearTopNovel data={artifact.data} />
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <YearGenreRadar data={artifact.data} />
                            <YearStatusDistribution data={artifact.data} />
                        </div>
                        <YearMonthlyActivity data={artifact.data} />
                        <YearBingeHighlights data={artifact.data} />
                    </div>

                    <YearCompletedTimeline data={artifact.data} />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default YearStatisticsPage;
