import type { FC } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack, useIsFocused } from 'expo-router';
import { Users } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

import type { FollowUserResponse } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { byUsername, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import {
    DEFAULT_PAGE_SIZE,
    type FollowListKind,
    followListOptions,
} from '../queries';
import FollowUserRow, { FollowUserRowSkeleton } from './follow-user-row';

const COPY = {
    followers: {
        title: 'Стежать',
        emptyTitle: 'Ще ніхто не стежить',
        emptyDescription:
            'Тут з’являться користувачі, які стежать за цим профілем',
    },
    followings: {
        title: 'Відстежується',
        emptyTitle: 'Ще ні за ким не стежить',
        emptyDescription:
            'Тут з’являться користувачі, за якими стежить цей профіль',
    },
} as const satisfies Record<FollowListKind, unknown>;

const SKELETON_ITEMS: null[] = Array.from(
    { length: DEFAULT_PAGE_SIZE },
    () => null,
);

type Props = {
    kind: FollowListKind;
    username: string;
};

/** The web's follow list modal as a pushed screen. */
const FollowList: FC<Props> = ({ kind, username }) => {
    const copy = COPY[kind];
    const { items, error, isFetchingNextPage, onEndReached, onRetry } =
        useInfiniteList<FollowUserResponse>({
            ...followListOptions(kind, username),
            subscribed: useIsFocused(),
        });
    const { refreshing, onRefresh } = usePullToRefresh(byUsername([username]));
    const data: (FollowUserResponse | null)[] =
        items ?? (error ? [] : SKELETON_ITEMS);

    return (
        <>
            <Stack.Title>{copy.title}</Stack.Title>
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="py-2"
                data={data}
                keyExtractor={(item, index) =>
                    item ? item.reference : `skeleton-${index}`
                }
                renderItem={({ item }) =>
                    item ? (
                        <FollowUserRow user={item} />
                    ) : (
                        <FollowUserRowSkeleton />
                    )
                }
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
                            icon={<Icon as={Users} />}
                            title={copy.emptyTitle}
                            description={copy.emptyDescription}
                        />
                    )
                }
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <ActivityIndicator className="py-4" />
                    ) : null
                }
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default FollowList;
