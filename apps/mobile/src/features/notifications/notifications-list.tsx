import { type FC, useMemo } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react-native';
import { View } from 'react-native';

import {
    convertNotification,
    groupNotificationsByDay,
    NOTIFICATION_SECTIONS,
    type NotificationItem,
} from '@hikka/core';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import NotificationRow from './notification-row';
import NotificationRowSkeleton from './notification-row-skeleton';
import NotificationSectionHeader from './notification-section-header';
import { isNotificationQuery, notificationsOptions } from './queries';
import { useMarkAllNotificationsSeen } from './use-notification-mutations';
import { useUnseenNotifications } from './use-unseen-notifications';

const SKELETON_ROWS = 3;

type Row =
    | { type: 'header'; key: string; label: string }
    | { type: 'item'; key: string; item: NotificationItem }
    | { type: 'header-skeleton'; key: string }
    | { type: 'skeleton'; key: string };

const SKELETON_LIST: Row[] = [
    { type: 'header-skeleton', key: 'header-skeleton' },
    ...Array.from(
        { length: SKELETON_ROWS },
        (_, i): Row => ({ type: 'skeleton', key: `skeleton-${i}` }),
    ),
];

const rowKey = (row: Row) => row.key;

const NotificationsList: FC = () => {
    const unseen = useUnseenNotifications();
    const markAll = useMarkAllNotificationsSeen();
    const { refreshing, onRefresh } = usePullToRefresh(isNotificationQuery);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery(notificationsOptions());

    const { rows, headerIndices } = useMemo(() => {
        const seen = new Set<string>();
        const items: NotificationItem[] = [];

        for (const page of data?.pages ?? []) {
            for (const response of page.list) {
                if (seen.has(response.reference)) continue;
                seen.add(response.reference);

                const item = convertNotification(response);
                if (item) items.push(item);
            }
        }

        const groups = groupNotificationsByDay(items);
        const result: Row[] = [];
        const indices: number[] = [];

        for (const { key, label } of NOTIFICATION_SECTIONS) {
            if (groups[key].length === 0) continue;

            indices.push(result.length);
            result.push({ type: 'header', key: `header-${key}`, label });

            for (const item of groups[key]) {
                result.push({ type: 'item', key: item.reference, item });
            }
        }

        return { rows: result, headerIndices: indices };
    }, [data]);

    const empty = error ? (
        <ErrorState
            error={error}
            onRetry={refetch}
            title="Не вдалося завантажити сповіщення"
            className="mt-8"
        />
    ) : (
        <EmptyState
            className="mt-8"
            icon={<Icon as={Bell} />}
            title="Сповіщень не знайдено"
            description="Тут будуть відображатись майбутні сповіщення"
        />
    );

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            data={isPending ? SKELETON_LIST : rows}
            keyExtractor={rowKey}
            getItemType={(row) => row.type}
            stickyHeaderIndices={isPending ? undefined : headerIndices}
            renderItem={({ item: row }) => {
                switch (row.type) {
                    case 'header':
                        return <NotificationSectionHeader label={row.label} />;
                    case 'header-skeleton':
                        return <NotificationSectionHeader />;
                    case 'skeleton':
                        return <NotificationRowSkeleton />;
                    default:
                        return <NotificationRow item={row.item} />;
                }
            }}
            ListHeaderComponent={
                unseen > 0 ? (
                    <View className="flex-row items-center justify-between gap-3 px-4 py-2">
                        <View className="flex-row items-center gap-2">
                            <Badge variant="warning">{String(unseen)}</Badge>
                            <Text className="text-muted-foreground text-sm">
                                Непрочитано
                            </Text>
                        </View>
                        <Button
                            variant="outline"
                            size="md"
                            disabled={markAll.isPending}
                            onPress={() => markAll.mutate()}
                        >
                            Прочитати всі
                        </Button>
                    </View>
                ) : null
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
    );
};

export default NotificationsList;
