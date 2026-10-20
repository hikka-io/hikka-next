import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { History } from 'lucide-react-native';
import { View } from 'react-native';

import { groupHistoryByDay } from '@hikka/core';

import HistoryRow from '@/components/list-items/history-row';
import HistoryRowSkeleton from '@/components/list-items/history-row-skeleton';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';

import { flattenPages } from '../flatten-pages';
import { HISTORY_PREVIEW_SIZE, homeFollowingHistoryOptions } from '../queries';
import { useHomePreferences } from '../use-home-preferences';
import { useOpenSitePath } from '../use-open-site-path';
import WidgetSection from '../widget-section';

const HISTORY_REFETCH_INTERVAL_MS = 60_000;

const HistoryCardSkeleton: FC = () => {
    return (
        <Card className="gap-0 overflow-hidden p-0">
            <View className="flex-row items-baseline gap-1.5 px-4 pt-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
            </View>
            {Array.from({ length: HISTORY_PREVIEW_SIZE }, (_, index) => (
                <View key={index}>
                    {index > 0 && <Separator />}
                    <HistoryRowSkeleton showUser className="px-4 py-3" />
                </View>
            ))}
        </Card>
    );
};

export const HistoryWidgetSkeleton: FC = () => {
    return (
        <WidgetSection title="Активність">
            <HistoryCardSkeleton />
        </WidgetSection>
    );
};

type Props = {
    username: string;
};

const HistoryWidget: FC<Props> = ({ username }) => {
    const focused = useIsFocused();
    const openSitePath = useOpenSitePath();
    const { titleLanguage, nameLanguage } = useHomePreferences();
    const { data, isPending, isError, refetch } = useInfiniteQuery({
        ...homeFollowingHistoryOptions(),
        refetchInterval: focused ? HISTORY_REFETCH_INTERVAL_MS : false,
    });
    const list = flattenPages(data);
    const days = list && groupHistoryByDay(list, Date.now());

    return (
        <WidgetSection
            title="Активність"
            onPress={() =>
                openSitePath(`/u/${username}/history?type=following`)
            }
        >
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {isPending && <HistoryCardSkeleton />}
            {days && days.length > 0 && (
                <Card className="gap-0 overflow-hidden p-0">
                    {days.map((day, dayIndex) => (
                        <View key={day.key}>
                            {dayIndex > 0 && <Separator />}
                            <View className="flex-row items-baseline gap-1.5 px-4 pt-3">
                                <Text className="font-medium text-xs">
                                    {day.label}
                                </Text>
                                <Text className="text-muted-foreground text-xs">
                                    {day.detail}
                                </Text>
                            </View>
                            {day.items.map((item) => (
                                <HistoryRow
                                    key={item.reference}
                                    item={item}
                                    titleLanguage={titleLanguage}
                                    nameLanguage={nameLanguage}
                                    showUser
                                    className="px-4 py-3"
                                />
                            ))}
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={History} />}
                    title="Історія відсутня"
                    description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                />
            )}
        </WidgetSection>
    );
};

export default HistoryWidget;
