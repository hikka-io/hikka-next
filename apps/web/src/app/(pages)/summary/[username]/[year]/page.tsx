import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchArtifact, prefetchUserByUsername } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import CoverImage from '@/components/cover-image';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import P from '@/components/typography/p';

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
import { generateMetadata as _generateMetadata } from '@/utils/metadata';

interface Props {
    params: Promise<{
        username: string;
        year: string;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { username, year } = params;

    return _generateMetadata({
        title: `Підсумки ${year} року / ${username}`,
        description: `Річна статистика користувача ${username} за ${year} рік`,
    });
}

const YearStatisticsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { username, year } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const user = await prefetchUserByUsername({
        username,
        clientConfig,
        queryClient,
    });

    if (!user) {
        return redirect('/');
    }

    const artifact = await prefetchArtifact<YearStatistics>({
        username,
        name: `year-summary-${year}`,
        queryClient,
        clientConfig,
    });

    if (!artifact) {
        return redirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CoverImage cover={user?.cover} />
            <Breadcrumbs>
                <Link
                    href={`/u/${username}`}
                    className="line-clamp-1 break-all text-sm font-bold hover:underline"
                >
                    {username}
                </Link>
                <P className="text-sm font-bold">Підсумки {year} року</P>
            </Breadcrumbs>
            <div className="flex flex-col gap-8 container max-w-3xl p-0 isolate">
                <YearHero data={artifact.data} username={username} />
                <PrivacySetting />

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
        </HydrationBoundary>
    );
};

export default YearStatisticsPage;
