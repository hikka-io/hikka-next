import { type FC, useCallback, useMemo, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Rss } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

import type { FeedContentTypeEnum } from '@hikka/api';
import { buildFeedArgs, type FeedFilters, isFeedDisabled } from '@hikka/core';

import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/features/auth';
import { cn } from '@/utils/cn';

import FeedHeader from './feed/feed-header';
import FeedItem from './feed/feed-item';
import FeedItemSkeleton from './feed/feed-item-skeleton';
import { type FeedItemResponse, getFeedItemKey } from './feed/feed-item-types';
import { FEED_SKELETON_SIZE, homeFeedOptions } from './queries';
import { useHomePreferences } from './use-home-preferences';
import WidgetError from './widget-error';
import ArticlesWidget from './widgets/articles-widget';
import CollectionsWidget from './widgets/collections-widget';
import HistoryWidget from './widgets/history-widget';
import JoinCard from './widgets/join-card';
import OngoingsWidget from './widgets/ongoings-widget';
import ScheduleWidget from './widgets/schedule-widget';
import TrackerWidget from './widgets/tracker-widget';

type Row =
    | { type: 'join' }
    | { type: 'tracker' }
    | { type: 'history' }
    | { type: 'ongoings' }
    | { type: 'schedule' }
    | { type: 'collections' }
    | { type: 'articles' }
    | { type: 'feed-header' }
    | { type: 'feed-skeleton'; index: number }
    | { type: 'feed-empty' }
    | { type: 'feed-error' }
    | { type: 'feed-item'; item: FeedItemResponse };

const FEED_ROWS = new Set<Row['type']>([
    'feed-skeleton',
    'feed-empty',
    'feed-error',
    'feed-item',
]);

const rowKey = (row: Row) => {
    switch (row.type) {
        case 'feed-skeleton':
            return `feed-skeleton-${row.index}`;
        case 'feed-item':
            return getFeedItemKey(row.item);
        default:
            return row.type;
    }
};

const HomeScreen: FC = () => {
    const queryClient = useQueryClient();
    const { user, hasToken } = useSession();
    const { feed, widgets } = useHomePreferences();
    const username = user?.username ?? undefined;

    const [refreshing, setRefreshing] = useState(false);
    const [feedActive, setFeedActive] = useState(false);
    const [typeOverride, setTypeOverride] = useState<
        FeedContentTypeEnum | null | undefined
    >();
    const [onlyFollowedOverride, setOnlyFollowedOverride] = useState<
        boolean | undefined
    >();

    const activeType =
        typeOverride !== undefined
            ? typeOverride
            : feed.feed_content_types?.length === 1
              ? feed.feed_content_types[0]
              : null;
    const onlyFollowed = user
        ? (onlyFollowedOverride ?? feed.only_followed ?? false)
        : false;

    const filters: FeedFilters = useMemo(() => {
        const saved = user ? feed : {};

        return typeOverride !== undefined
            ? { ...saved, feed_content_types: typeOverride && [typeOverride] }
            : saved;
    }, [user, feed, typeOverride]);

    const feedArgs = useMemo(
        () => buildFeedArgs(filters, onlyFollowed),
        [filters, onlyFollowed],
    );
    const feedDisabled = isFeedDisabled(filters);

    const feedQuery = useInfiniteQuery({
        ...homeFeedOptions(feedArgs),
        enabled: feedActive && !feedDisabled,
    });

    const feedItems = useMemo(() => {
        const seen = new Set<string>();

        return feedQuery.data?.pages.flat(1).filter((item) => {
            const key = getFeedItemKey(item);
            if (seen.has(key)) return false;
            seen.add(key);

            return true;
        });
    }, [feedQuery.data]);

    const rows = useMemo(() => {
        const result: Row[] = [];

        if (!hasToken) result.push({ type: 'join' });
        if (user && widgets.has('tracker')) result.push({ type: 'tracker' });
        if (user && widgets.has('history')) result.push({ type: 'history' });
        if (widgets.has('ongoings')) result.push({ type: 'ongoings' });
        if (widgets.has('schedule')) result.push({ type: 'schedule' });
        if (widgets.has('collections')) result.push({ type: 'collections' });
        if (widgets.has('articles')) result.push({ type: 'articles' });

        if (widgets.has('feed')) {
            result.push({ type: 'feed-header' });

            if (feedDisabled || feedItems?.length === 0) {
                result.push({ type: 'feed-empty' });
            } else if (feedQuery.isError && !feedItems) {
                result.push({ type: 'feed-error' });
            } else if (!feedItems) {
                for (let index = 0; index < FEED_SKELETON_SIZE; index++) {
                    result.push({ type: 'feed-skeleton', index });
                }
            } else {
                for (const item of feedItems) {
                    result.push({ type: 'feed-item', item });
                }
            }
        }

        return result;
    }, [hasToken, user, widgets, feedDisabled, feedItems, feedQuery.isError]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({ type: 'active' });
        setRefreshing(false);
    }, [queryClient]);

    const loadMore = () => {
        if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
            feedQuery.fetchNextPage();
        }
    };

    const markFeedActive = useCallback(() => setFeedActive(true), []);

    const renderItem = ({ item: row }: { item: Row }) => {
        if (FEED_ROWS.has(row.type)) return renderFeedRow(row);

        return (
            <View
                className={cn(
                    'px-4',
                    row.type === 'feed-header' ? 'pb-3' : 'pb-6',
                )}
            >
                {renderWidget(row)}
            </View>
        );
    };

    const renderWidget = (row: Row) => {
        switch (row.type) {
            case 'join':
                return <JoinCard />;
            case 'tracker':
                return username ? <TrackerWidget username={username} /> : null;
            case 'history':
                return username ? <HistoryWidget username={username} /> : null;
            case 'ongoings':
                return <OngoingsWidget />;
            case 'schedule':
                return <ScheduleWidget signedIn={!!user} />;
            case 'collections':
                return <CollectionsWidget username={username} />;
            case 'articles':
                return <ArticlesWidget username={username} />;
            case 'feed-header':
                return (
                    <FeedHeader
                        activeType={activeType}
                        onTypeChange={setTypeOverride}
                        onlyFollowed={onlyFollowed}
                        onOnlyFollowedChange={
                            user ? setOnlyFollowedOverride : undefined
                        }
                        onMount={markFeedActive}
                    />
                );
            default:
                return null;
        }
    };

    const renderFeedRow = (row: Row) => {
        switch (row.type) {
            case 'feed-skeleton':
                return <FeedItemSkeleton />;
            case 'feed-empty':
                return (
                    <View className="p-4">
                        <EmptyState
                            icon={<Icon as={Rss} />}
                            title="Стрічка порожня"
                            description={
                                feedDisabled
                                    ? 'Усі розділи стрічки вимкнено. Увімкніть хоча б один розділ у фільтрах.'
                                    : onlyFollowed
                                      ? 'У вашій персональній стрічці поки немає записів. Підпишіться на інших користувачів, щоб бачити їхню активність.'
                                      : 'Наразі тут немає записів. Спробуйте змінити фільтри або повернутися пізніше.'
                            }
                        />
                    </View>
                );
            case 'feed-error':
                return (
                    <View className="p-4">
                        <WidgetError onRetry={feedQuery.refetch} />
                    </View>
                );
            case 'feed-item':
                return <FeedItem item={row.item} />;
            default:
                return null;
        }
    };

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            data={rows}
            keyExtractor={rowKey}
            getItemType={(row) => row.type}
            renderItem={renderItem}
            CellRendererComponent={undefined}
            onEndReached={loadMore}
            onEndReachedThreshold={1}
            refreshing={refreshing}
            onRefresh={refresh}
            ListFooterComponent={
                feedQuery.isFetchingNextPage ? (
                    <ActivityIndicator className="py-4" />
                ) : null
            }
        />
    );
};

export default HomeScreen;
