import { Metadata } from 'next';
import * as React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ScheduleList from '@/app/(pages)/schedule/components/schedule-list';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import { getCookie } from '@/utils/actions';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Календар / %s / Hikka',
            default: 'Календар',
        },
    });
}

const ScheduleListPage = async () => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: [
            'animeSchedule',
            { season: undefined, status: 'ongoing', auth },
        ],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                status: 'ongoing',
                page: pageParam,
                auth,
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <ScheduleList />
        </HydrationBoundary>
    );
};

export default ScheduleListPage;
