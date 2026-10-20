import { type FC, type ReactElement, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import type { Query } from '@tanstack/react-query';
import { Stack, useIsFocused } from 'expo-router';
import { History } from 'lucide-react-native';
import { View } from 'react-native';

import type { HistoryResponse } from '@hikka/api';
import { groupHistoryByDay, type QueryId, queryId } from '@hikka/core';

import ListFooter from '@/components/list-footer';
import HistoryRow from '@/components/list-items/history-row';
import HistoryRowSkeleton from '@/components/list-items/history-row-skeleton';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import {
    DEFAULT_PAGE_SIZE,
    type HistorySource,
    userHistoryOptions,
} from './queries';

const SOURCES: { label: string; value: HistorySource }[] = [
    { label: 'Власна', value: 'user' },
    { label: 'Відстежується', value: 'following' },
];

const FOLLOWING_HISTORY_ID: QueryId = 'followingHistory';

// The following feed is the viewer's, so its key carries no username to refresh by.
const FOLLOWING_HISTORY = (query: Query) =>
    queryId(query.queryKey) === FOLLOWING_HISTORY_ID;

type Row =
    | { kind: 'day'; key: string; label: string; detail: string }
    | { kind: 'item'; key: string; item: HistoryResponse }
    | { kind: 'skeleton'; key: string };

const SKELETON_ROWS: Row[] = Array.from(
    { length: DEFAULT_PAGE_SIZE },
    (_, index) => ({ kind: 'skeleton', key: `skeleton-${index}` }),
);

const toRows = (items: HistoryResponse[]): Row[] =>
    groupHistoryByDay(items, Date.now()).flatMap((day) => [
        { kind: 'day', key: day.key, label: day.label, detail: day.detail },
        ...day.items.map(
            (item): Row => ({ kind: 'item', key: item.reference, item }),
        ),
    ]);

type FeedProps = {
    username: string;
    source: HistorySource;
    header: ReactElement | null;
};

const HistoryFeed: FC<FeedProps> = ({ username, source, header }) => {
    const following = source === 'following';
    const {
        items,
        error,
        isFetchingNextPage,
        isFetchNextPageError,
        onRetryNextPage,
        onEndReached,
        onRetry,
    } = useInfiniteList<HistoryResponse>({
        ...userHistoryOptions(username, source),
        subscribed: useIsFocused(),
    });
    const { refreshing, onRefresh } = usePullToRefresh(
        following ? FOLLOWING_HISTORY : byUsername([username]),
    );
    const rows = items ? toRows(items) : error ? [] : SKELETON_ROWS;

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="pb-4"
            data={rows}
            keyExtractor={(row) => row.key}
            getItemType={(row) => row.kind}
            renderItem={({ item: row }) => {
                if (row.kind === 'day') {
                    return (
                        <View className="flex-row items-baseline gap-1.5 px-4 pt-4 pb-1">
                            <Text className="font-medium text-sm">
                                {row.label}
                            </Text>
                            <Text className="text-muted-foreground text-xs">
                                {row.detail}
                            </Text>
                        </View>
                    );
                }

                return row.kind === 'item' ? (
                    <HistoryRow
                        item={row.item}
                        showUser={following}
                        className="px-4 py-2"
                    />
                ) : (
                    <HistoryRowSkeleton
                        showUser={following}
                        className="px-4 py-2"
                    />
                );
            }}
            ListHeaderComponent={header}
            ListEmptyComponent={
                error ? (
                    <ErrorState
                        error={error}
                        onRetry={onRetry}
                        className="mt-8"
                    />
                ) : (
                    <EmptyState
                        className="mt-8"
                        icon={<Icon as={History} />}
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )
            }
            ListFooterComponent={
                <ListFooter
                    fetching={isFetchingNextPage}
                    error={isFetchNextPageError}
                    onRetry={onRetryNextPage}
                />
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    );
};

type Props = {
    username: string;
    initialSource?: HistorySource;
};

/** The web's `/u/<name>/history`; the owner also gets the history of the users they follow. */
const HistoryPage: FC<Props> = ({ username, initialSource }) => {
    const { user: viewer } = useSession();
    const owner = viewer?.username?.toLowerCase() === username.toLowerCase();
    const [selected, setSelected] = useState<HistorySource>(
        initialSource ?? 'user',
    );
    const source = owner ? selected : 'user';

    return (
        <>
            <Stack.Title>Історія</Stack.Title>
            <HistoryFeed
                key={source}
                username={username}
                source={source}
                header={
                    owner ? (
                        <View className="px-4 pt-2 pb-2">
                            <SegmentedControl
                                options={SOURCES}
                                value={source}
                                onValueChange={setSelected}
                            />
                        </View>
                    ) : null
                }
            />
        </>
    );
};

export default HistoryPage;
