import type { FC } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { UserRound } from 'lucide-react-native';

import type { MainContentTypeEnum } from '@hikka/api';
import type { FollowingUser } from '@hikka/core';

import ListFooter from '@/components/list-footer';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { SignInPrompt, useSession } from '@/features/auth';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { bySlug, usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import FollowingRow, { FollowingRowSkeleton } from './following-row';
import { contentFollowingOptions, FOLLOWING_PAGE_SIZE } from './queries';

const SKELETON_ITEMS: null[] = Array.from(
    { length: FOLLOWING_PAGE_SIZE },
    () => null,
);

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
};

/** The web's followings sheet as a pushed screen: every followed user who tracks the title. */
const ContentFollowingList: FC<Props> = ({ contentType, slug }) => {
    const { hasToken } = useSession();
    const options = {
        ...contentFollowingOptions(contentType, slug),
        enabled: hasToken,
    };
    const {
        items,
        error,
        isFetchingNextPage,
        isFetchNextPageError,
        onRetryNextPage,
        onEndReached,
        onRetry,
    } = useInfiniteList<FollowingUser>(options);
    const { refreshing, onRefresh } = usePullToRefresh(bySlug(slug));
    const data: (FollowingUser | null)[] =
        items ?? (error ? [] : SKELETON_ITEMS);

    if (!hasToken) {
        return (
            <>
                <Stack.Title>Відстежується</Stack.Title>
                <SignInPrompt
                    icon={UserRound}
                    description="Увійдіть, щоб бачити, хто з користувачів, за якими ви стежите, додав цей тайтл до списку"
                />
            </>
        );
    }

    return (
        <>
            <Stack.Title>Відстежується</Stack.Title>
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="pt-2 pb-8"
                data={data}
                keyExtractor={(item, index) =>
                    item ? item.reference : `skeleton-${index}`
                }
                renderItem={({ item }) =>
                    item ? (
                        <FollowingRow user={item} />
                    ) : (
                        <FollowingRowSkeleton />
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
                            icon={<Icon as={UserRound} />}
                            title="Тут поки порожньо"
                            description="Ніхто з користувачів, за якими ви стежите, ще не додав цей тайтл до списку"
                        />
                    )
                }
                ListFooterComponent={
                    <ListFooter
                        fetching={isFetchingNextPage}
                        refreshing={refreshing}
                        error={isFetchNextPageError}
                        onRetry={onRetryNextPage}
                    />
                }
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </>
    );
};

export default ContentFollowingList;
