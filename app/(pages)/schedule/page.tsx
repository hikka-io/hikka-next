import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { FC } from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import Header from '@/components/ui/header';

import ScheduleFilters from '@/features/filters/schedule-filters.component';
import ScheduleFiltersModal from '@/features/modals/schedule-filters-modal';
import ScheduleList from '@/features/schedule/schedule-list/schedule-list.component';

import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import _generateMetadata from '@/utils/generateMetadata';
import getCurrentSeason from '@/utils/getCurrentSeason';
import getQueryClient from '@/utils/getQueryClient';

export const metadata: Metadata = _generateMetadata({
    title: {
        template: 'Календар / %s / Hikka',
        default: 'Календар',
    },
});

interface Props {
    searchParams: Record<string, any>;
}

const ScheduleListPage: FC<Props> = async ({ searchParams }) => {
    const queryClient = await getQueryClient();

    const only_watch = searchParams.only_watch || undefined;
    const season = (searchParams.season as API.Season) || getCurrentSeason()!;
    const year = searchParams.year || String(new Date().getFullYear());
    const status =
        searchParams.status && searchParams.status.length > 0
            ? searchParams.status
            : ['ongoing', 'announced'];

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['animeSchedule', { season, status, year, only_watch }],
        queryFn: ({ pageParam = 1, meta }) =>
            getAnimeSchedule({
                page: pageParam,
                params: {
                    status,
                    only_watch,
                    airing_season: [season, year],
                },
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <Block>
                    <div className="flex items-center justify-between">
                        <Header title="Календар" />
                        <ScheduleFiltersModal>
                            <Button
                                variant="outline"
                                className="flex lg:hidden"
                            >
                                <AntDesignFilterFilled /> Фільтри
                            </Button>
                        </ScheduleFiltersModal>
                    </div>
                    <Card className="hidden w-full opacity-60 transition-opacity hover:opacity-100 lg:block">
                        <ScheduleFilters />
                    </Card>
                </Block>
                <ScheduleList />
            </div>
        </HydrationBoundary>
    );
};

export default ScheduleListPage;
