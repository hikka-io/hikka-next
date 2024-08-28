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
import ScheduleFiltersModal from '@/features/modals/schedule-filters-modal.component';
import ScheduleList from '@/features/schedule/schedule-list/schedule-list.component';

import { prefetchAnimeSchedule } from '@/services/hooks/stats/use-anime-schedule';
import _generateMetadata from '@/utils/generate-metadata';
import getCurrentSeason from '@/utils/get-current-season';
import getQueryClient from '@/utils/get-query-client';

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

    await prefetchAnimeSchedule({
        status,
        only_watch,
        airing_season: [season, year],
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <Block>
                    <div className="flex items-center justify-between">
                        <Header variant="h2" title="Календар" />
                        <ScheduleFiltersModal>
                            <Button
                                variant="outline"
                                className="flex lg:hidden"
                            >
                                <AntDesignFilterFilled /> Фільтри
                            </Button>
                        </ScheduleFiltersModal>
                    </div>
                    <Card className="hidden w-full lg:block">
                        <ScheduleFilters />
                    </Card>
                </Block>
                <ScheduleList />
            </div>
        </HydrationBoundary>
    );
};

export default ScheduleListPage;
