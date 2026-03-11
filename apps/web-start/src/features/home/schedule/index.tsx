'use client';

import { ContentStatusEnum, SeasonEnum } from '@hikka/client';
import { useSearchAnimeSchedule } from '@hikka/react';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { getCurrentSeason } from '@/utils/season';

import ScheduleItem from './components/schedule-item';

const Schedule = () => {
    const search = useFilterSearch<{
        only_watch?: string | boolean;
        season?: string;
        year?: string | number;
        status?: string | string[];
    }>();

    const only_watch = search.only_watch !== undefined
        ? Boolean(search.only_watch)
        : undefined;
    const season =
        (search.season as SeasonEnum) || getCurrentSeason()!;
    const year = search.year || new Date().getFullYear();
    const status = (
        search.status
            ? Array.isArray(search.status)
                ? search.status
                : [search.status]
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
