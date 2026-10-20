import { type FC, useMemo } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { toast } from 'sonner-native';

import {
    apiErrorMessage,
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
import { Text } from '@/components/ui/text';
import { usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import NotificationRow from './notification-row';
import NotificationRowSkeleton from './notification-row-skeleton';
import { isNotificationQuery, notificationsOptions } from './queries';
import { useMarkNotificationsSeen } from './use-notification-mutations';
import { useUnseenNotifications } from './use-unseen-notifications';

const MARK_ALL_ERROR = 'Не вдалося завантажити сповіщення';
const SKELETON_ROWS = 6;

type Row =
    | { type: 'header'; key: string; label: string }
    | { type: 'item'; key: string; item: NotificationItem }
    | { type: 'skeleton'; key: string };

const SKELETON_LIST: Row[] = Array.from({ length: SKELETON_ROWS }, (_, i) => ({
    type: 'skeleton',
    key: `skeleton-${i}`,
}));

const rowKey = (row: Row) => row.key;

const NotificationsList: FC = () => {
    const unseen = useUnseenNotifications();
    const markAll = useMarkNotificationsSeen({ notify: true });
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

    const rows = useMemo<Row[]>(() => {
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

        return NOTIFICATION_SECTIONS.flatMap(({ key, label }): Row[] =>
            groups[key].length === 0
                ? []
                : [
                      { type: 'header', key: `header-${key}`, label },
                      ...groups[key].map(
                          (item): Row => ({
                              type: 'item',
                              key: item.reference,
                              item,
                          }),
                      ),
                  ],
        );
    }, [data]);

    // One request: the backend marks the newest notification and every older one. The newest is read fresh, since newer ones may have arrived since the list loaded.
    const markAllSeen = async () => {
        const result = await refetch();
        const newest = result.data?.pages[0]?.list[0];

        if (result.isError) {
            toast.error(apiErrorMessage(result.error, MARK_ALL_ERROR));
            return;
        }

        if (newest) {
            markAll.mutate({
                reference: newest.reference,
                created: newest.created,
            });
        }
    };

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
            renderItem={({ item: row }) => {
                switch (row.type) {
                    case 'header':
                        return (
                            <View className="border-border border-b bg-surface-inset px-4 py-1.5">
                                <Text className="font-medium text-muted-foreground text-xs">
                                    {row.label}
                                </Text>
                            </View>
                        );
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
                            onPress={markAllSeen}
                        >
                            Прочитати всі
                        </Button>
                    </View>
                ) : null
            }
            ListEmptyComponent={empty}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <ActivityIndicator className="py-4" />
                ) : null
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
