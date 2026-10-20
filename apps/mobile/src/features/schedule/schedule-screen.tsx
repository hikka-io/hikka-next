import { type FC, useMemo, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import type { AnimeScheduleResponse } from '@hikka/api';
import { formatScheduleDay, groupScheduleByDay } from '@hikka/core';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import { isScheduleQuery, scheduleOptions } from './queries';
import ScheduleDayHeader from './schedule-day-header';
import {
    defaultScheduleFilters,
    hasActiveScheduleFilters,
    type ScheduleFilters,
    scheduleSummary,
    toScheduleSearch,
} from './schedule-filters';
import ScheduleRow from './schedule-row';
import ScheduleRowSkeleton from './schedule-row-skeleton';
import ScheduleToolbar from './schedule-toolbar';

const SKELETON_ROWS = 6;

type Row =
    | { type: 'day'; key: string; weekday: string; date: string }
    | { type: 'item'; key: string; item: AnimeScheduleResponse }
    | { type: 'day-skeleton'; key: string }
    | { type: 'skeleton'; key: string };

const SKELETON_LIST: Row[] = [
    { type: 'day-skeleton', key: 'day-skeleton' },
    ...Array.from(
        { length: SKELETON_ROWS },
        (_, i): Row => ({ type: 'skeleton', key: `skeleton-${i}` }),
    ),
];

const rowKey = (row: Row) => row.key;

const ScheduleScreen: FC = () => {
    const [filters, setFilters] = useState(defaultScheduleFilters);
    const { refreshing, onRefresh } = usePullToRefresh(isScheduleQuery);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery(scheduleOptions(toScheduleSearch(filters)));

    const { rows, dayIndices } = useMemo(() => {
        const list = data?.pages.flatMap((page) => page.list) ?? [];
        const result: Row[] = [];
        const indices: number[] = [];

        for (const { day, items } of groupScheduleByDay(list)) {
            indices.push(result.length);
            result.push({
                type: 'day',
                key: `day-${day}`,
                ...formatScheduleDay(day),
            });

            items.forEach((item, index) => {
                result.push({
                    type: 'item',
                    key: `${day}-${item.anime.slug}-${item.episode}-${index}`,
                    item,
                });
            });
        }

        return { rows: result, dayIndices: indices };
    }, [data]);

    const filtered = hasActiveScheduleFilters(filters);

    const empty = error ? (
        <ErrorState
            error={error}
            onRetry={refetch}
            title="Не вдалося завантажити календар"
            className="mt-8"
        />
    ) : (
        <EmptyState
            className="mt-8"
            title="Не знайдено результатів за Вашим запитом"
            description="Очистіть або змініть фільтри, щоб отримати інший результат"
            action={
                filtered ? (
                    <Button
                        variant="secondary"
                        onPress={() => setFilters(defaultScheduleFilters())}
                    >
                        Очистити
                    </Button>
                ) : undefined
            }
        />
    );

    return (
        <>
            <ScheduleToolbar filters={filters} onChange={setFilters} />
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ paddingBottom: 16 }}
                data={isPending ? SKELETON_LIST : rows}
                keyExtractor={rowKey}
                getItemType={(row) => row.type}
                stickyHeaderIndices={isPending ? undefined : dayIndices}
                renderItem={({ item: row }) => {
                    switch (row.type) {
                        case 'day':
                            return (
                                <ScheduleDayHeader
                                    weekday={row.weekday}
                                    date={row.date}
                                />
                            );
                        case 'day-skeleton':
                            return <ScheduleDayHeader />;
                        case 'skeleton':
                            return <ScheduleRowSkeleton />;
                        default:
                            return <ScheduleRow item={row.item} />;
                    }
                }}
                ListHeaderComponent={
                    <View className="px-4 pb-1">
                        <Text className="text-muted-foreground text-sm">
                            {scheduleSummary(filters)}
                        </Text>
                    </View>
                }
                ListEmptyComponent={empty}
                ListFooterComponent={
                    isFetchingNextPage ? <Spinner className="py-4" /> : null
                }
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default ScheduleScreen;
