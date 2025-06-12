'use client';

import { ContentStatusEnum, SeasonEnum } from '@hikka/client';
import { useSearchAnimeSchedule } from '@hikka/react';
import { useSearchParams } from 'next/navigation';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import getCurrentSeason from '@/utils/get-current-season';

import ScheduleItem from './schedule-item';

const Schedule = () => {
    const searchParams = useSearchParams();

    const only_watch = searchParams.get('only_watch')
        ? Boolean(searchParams.get('only_watch'))
        : undefined;
    const season =
        (searchParams.get('season') as SeasonEnum) || getCurrentSeason()!;
    const year = searchParams.get('year') || new Date().getFullYear();
    const status = (
        searchParams.getAll('status').length > 0
            ? searchParams.getAll('status')
            : ['ongoing', 'announced']
    ) as ContentStatusEnum[];

    const { list } = useSearchAnimeSchedule({
        args: {
            airing_season: [season, Number(year)],
            status,
            only_watch,
        },
    });

    const filteredList = list
        ?.filter((item) => item.airing_at * 1000 > Date.now())
        .slice(0, 4);

    return (
        <Block>
            <Header href="/schedule">
                <HeaderContainer>
                    <HeaderTitle variant="h2">Календар</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack className="grid-min-18 xl:grid-cols-4">
                {filteredList?.map((item, index) => (
                    <ScheduleItem key={item.anime.slug + index} item={item} />
                ))}
            </Stack>
        </Block>
    );
};

export default Schedule;
