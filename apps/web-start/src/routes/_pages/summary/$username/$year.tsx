import {
    artifactOptions,
    userByUsernameOptions,
} from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';
import Link from '@/components/ui/link';

import CoverImage from '@/components/cover-image';
import Breadcrumbs from '@/features/common/nav-breadcrumbs';
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

export const Route = createFileRoute('/_pages/summary/$username/$year')({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { username, year } = params;

        const user = await queryClient.ensureQueryData(
            userByUsernameOptions(hikkaClient, { username }),
        );

        if (!user) throw redirect({ to: '/' });

        const artifact = await queryClient.ensureQueryData(
            artifactOptions<YearStatistics>(hikkaClient, {
                username,
                name: `year-summary-${year}`,
            }),
        );

        if (!artifact) throw redirect({ to: '/' });

        return { user, artifact };
    },
    head: ({ loaderData, params }) => ({
        meta: [
            {
                title: `Підсумки ${params.year} року / ${params.username} / Hikka`,
            },
            {
                name: 'description',
                content: `Річна статистика користувача ${params.username} за ${params.year} рік`,
            },
        ],
    }),
    component: YearStatisticsPage,
});

function YearStatisticsPage() {
    const { username, year } = Route.useParams();
    const { user, artifact } = Route.useLoaderData();

    return (
        <>
            <CoverImage cover={user?.cover} />
            <Breadcrumbs>
                <Link
                    to={`/u/${username}`}
                    className="line-clamp-1 break-all text-sm font-bold hover:underline"
                >
                    {username}
                </Link>
                <p className="text-sm font-bold">Підсумки {year} року</p>
            </Breadcrumbs>
            <div className="flex flex-col gap-8 w-full mx-auto max-w-3xl p-0 isolate">
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
        </>
    );
}
