import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    AnimeStatusEnum,
    animeScheduleInfiniteOptions,
    paginationPageParam,
    type SeasonEnum,
} from '@hikka/api';

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
import { generateHeadMeta } from '@/utils/metadata';
import { scheduleSearchSchema } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

export const Route = createFileRoute('/_pages/schedule')({
    validateSearch: zodValidator(scheduleSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { only_watch, season, year, status } = deps;

        const resolvedSeason = (season as SeasonEnum) || getCurrentSeason()!;
        const resolvedYear = Number(year) || new Date().getFullYear();
        const resolvedStatus =
            status && status.length > 0
                ? (status as AnimeStatusEnum[])
                : [AnimeStatusEnum.ONGOING, AnimeStatusEnum.ANNOUNCED];

        await queryClient.prefetchInfiniteQuery({
            ...animeScheduleInfiniteOptions({
                body: {
                    status: resolvedStatus,
                    only_watch,
                    airing_season: [resolvedSeason as SeasonEnum, resolvedYear],
                },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });
    },
    head: () =>
        generateHeadMeta({
            title: 'Календар',
            description: 'Календар виходу нових серій аніме на Hikka',
            url: 'https://hikka.io/schedule',
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
                <Card className="hidden w-full bg-secondary/20 backdrop-blur-xl lg:block">
                    <ScheduleFilters />
                </Card>
            </Block>
            <ScheduleList />
        </div>
    );
}
