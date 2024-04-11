import { Metadata } from 'next';
import * as React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import SubHeader from '@/components/sub-header';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import { getCookie } from '@/utils/actions';
import _generateMetadata from '@/utils/generateMetadata';
import getCurrentSeason from '@/utils/getCurrentSeason';
import getQueryClient from '@/utils/getQueryClient';

import ScheduleFilters from '../../../components/filters/schedule-filters';
import ScheduleList from './components/schedule-list';


export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Календар / %s / Hikka',
            default: 'Календар',
        },
    });
}

const ScheduleListPage = async ({
    searchParams,
}: {
    searchParams: Record<string, any>;
}) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    const only_watch = searchParams.only_watch || undefined;
    const season = (searchParams.season as API.Season) || getCurrentSeason()!;
    const year = searchParams.year || String(new Date().getFullYear());
    const status =
        searchParams.status && searchParams.status.length > 0
            ? searchParams.status
            : ['ongoing'];

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['animeSchedule', { season, status, auth, year, only_watch }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                status,
                page: pageParam,
                auth,
                only_watch,
                airing_season: [season, year],
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                    <SubHeader title="Календар" />
                    <ScheduleFilters />
                </div>
                <ScheduleList />
            </div>
        </HydrationBoundary>
    );
};

export default ScheduleListPage;
