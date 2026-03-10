import { ContentStatusEnum, SeasonEnum } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import { searchAnimeScheduleOptions } from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    ScheduleFilters,
    ScheduleFiltersModal,
    ScheduleList,
} from '@/features/schedule';
import { getCurrentSeason } from '@/utils/season';

export const Route = createFileRoute('/_pages/schedule')({
    validateSearch: (search: Record<string, unknown>) => search as Record<string, any>,
    loader: async ({
        context: { queryClient, hikkaClient },
        location,
    }) => {
        const {
            only_watch,
            season,
            year,
            status,
        } = location.search as Record<string, any>;

        const resolvedSeason =
            (season as SeasonEnum) || getCurrentSeason()!;
        const resolvedYear = year || String(new Date().getFullYear());
        const resolvedStatus =
            status && status.length > 0
                ? status
                : [ContentStatusEnum.ONGOING, ContentStatusEnum.ANNOUNCED];

        await prefetchInfiniteQuery(queryClient,
            searchAnimeScheduleOptions(hikkaClient, {
                args: {
                    status: resolvedStatus,
                    only_watch,
                    airing_season: [resolvedSeason, resolvedYear],
                },
            }),
        );
    },
    head: () => ({
        meta: [{ title: 'Календар / Hikka' }],
    }),
    component: ScheduleListPage,
});

function ScheduleListPage() {
    return (
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
                <Card className="hidden w-full lg:block bg-secondary/20 backdrop-blur-xl">
                    <ScheduleFilters />
                </Card>
            </Block>
            <ScheduleList />
        </div>
    );
}
