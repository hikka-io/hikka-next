'use client';

import {
    AnimeScheduleResponse,
    ContentStatusEnum,
    SeasonEnum,
} from '@hikka/client';
import { useSearchAnimeSchedule } from '@hikka/react';
import { getUnixTime, startOfDay } from 'date-fns';
import { format } from 'date-fns/format';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import type { ScheduleSearch } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

import ScheduleItem from './components/schedule-item';

const ScheduleList = () => {
    const search = useFilterSearch<ScheduleSearch>();

    const only_watch = search.only_watch ?? undefined;
    const season = (search.season as SeasonEnum) || getCurrentSeason()!;
    const year = Number(search.year) || new Date().getFullYear();
    const status = (
        search.status?.length ? search.status : ['ongoing', 'announced']
    ) as ContentStatusEnum[];

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoading,
        ref,
    } = useSearchAnimeSchedule({
        args: {
            airing_season: [season, year],
            status,
            only_watch,
        },
    });

    const sortedList = list?.reduce(
        (acc: Record<string, AnimeScheduleResponse[]>, item) => {
            const day = getUnixTime(startOfDay(item.airing_at * 1000));
            if (!(day in acc)) {
                acc[day] = [];
            }

            acc[day] = [...acc[day], item];
            return acc;
        },
        {},
    );

    return (
        <div className="flex flex-col gap-12">
            {sortedList &&
                Object.keys(sortedList).map((day) => {
                    const formattedDay = format(
                        Number(day) * 1000,
                        'eeee ,d MMMM',
                    ).split(',');

                    return (
                        <Block key={day}>
                            <Header className="capitalize">
                                <HeaderContainer>
                                    <HeaderTitle>
                                        {formattedDay[0]}
                                        <span className="border-primary-border bg-primary text-primary-foreground rounded-sm border p-1 px-2">
                                            {formattedDay[1]}
                                        </span>
                                    </HeaderTitle>
                                </HeaderContainer>
                            </Header>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {sortedList[day].map((item, index) => (
                                    <ScheduleItem
                                        key={item.anime.slug + index}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </Block>
                    );
                })}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
            {(!list || list.length === 0) && !isLoading && <FiltersNotFound />}
        </div>
    );
};

export default ScheduleList;
