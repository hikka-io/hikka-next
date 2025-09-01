import { ContentStatusEnum, SeasonEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchSearchAnimeSchedule } from '@hikka/react/server';
import { Metadata } from 'next';
import { FC } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { ScheduleFilters } from "@/features/filters";
import { ScheduleFiltersModal } from "@/features/modals";
import ScheduleList from '@/features/schedule/schedule-list/schedule-list';

import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';
import getCurrentSeason from '@/utils/season-utils';

export const metadata: Metadata = _generateMetadata({
    title: {
        template: 'Календар / %s / Hikka',
        default: 'Календар',
    },
});

interface Props {
    searchParams: Record<string, any>;
}

const ScheduleListPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const only_watch = searchParams.only_watch || undefined;
    const season = (searchParams.season as SeasonEnum) || getCurrentSeason()!;
    const year = searchParams.year || String(new Date().getFullYear());
    const status =
        searchParams.status && searchParams.status.length > 0
            ? searchParams.status
            : [ContentStatusEnum.ONGOING, ContentStatusEnum.ANNOUNCED];

    await prefetchSearchAnimeSchedule({
        args: {
            status,
            only_watch,
            airing_season: [season, year],
        },
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-12">
                <Block>
                    <div className="flex items-center justify-between">
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h2">Календар</HeaderTitle>
                            </HeaderContainer>
                        </Header>
                        <ScheduleFiltersModal>
                            <Button
                                size="md"
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
