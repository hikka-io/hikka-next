import {
    formatScheduleDay,
    groupScheduleByDay,
    type ScheduleSearch,
} from '@hikka/core';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useRouteSearch } from '@/utils/navigation';

import { scheduleOptions } from './queries';
import ScheduleItem from './schedule-item';

const ScheduleList = () => {
    const search = useRouteSearch<ScheduleSearch>();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoading,
        ref,
    } = useInfiniteList(scheduleOptions(search));

    const days = list && groupScheduleByDay(list);

    return (
        <div className="flex flex-col gap-12">
            {days?.map(({ day, items }) => {
                const { weekday, date } = formatScheduleDay(day);

                return (
                    <Block key={day}>
                        <Header>
                            <HeaderTitle>
                                {weekday}{' '}
                                <span className="rounded-sm border border-primary-border bg-primary p-1 px-2 text-primary-foreground">
                                    {date}
                                </span>
                            </HeaderTitle>
                        </Header>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {items.map((item, index) => (
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
