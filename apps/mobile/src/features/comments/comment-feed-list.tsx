import type { FC, ReactElement } from 'react';

import { FlashList } from '@shopify/flash-list';
import { MessageSquarePlus } from 'lucide-react-native';
import { View } from 'react-native';

import type { CommentResponse } from '@hikka/api';
import { COMMENT_LIST_IDS, queryId } from '@hikka/core';

import ListFooter from '@/components/list-footer';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import CommentSkeleton from './comment-skeleton';
import { COMMENT_PREVIEW_SIZE } from './queries';
import UserCommentRow from './user-comment-row';

const LIST_IDS = new Set<string>(COMMENT_LIST_IDS);

type Props = {
    options: { queryKey: readonly unknown[] };
    header?: ReactElement;
    emptyTitle: string;
    emptyDescription: string;
};

/** Comments from many threads, one row each: the latest comments and a user's comments. */
const CommentFeedList: FC<Props> = ({
    options,
    header,
    emptyTitle,
    emptyDescription,
}) => {
    const {
        items,
        error,
        isFetchingNextPage,
        isFetchNextPageError,
        onRetryNextPage,
        onEndReached,
        onRetry,
    } = useInfiniteList<CommentResponse>(options);
    const { refreshing, onRefresh } = usePullToRefresh((query) =>
        LIST_IDS.has(queryId(query.queryKey) ?? ''),
    );

    const empty = !items ? (
        error ? (
            <ErrorState error={error} onRetry={onRetry} className="mt-8" />
        ) : (
            <View className="gap-6 px-4">
                {Array.from({ length: COMMENT_PREVIEW_SIZE }, (_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders.
                    <CommentSkeleton key={index} />
                ))}
            </View>
        )
    ) : (
        <EmptyState
            icon={<Icon as={MessageSquarePlus} />}
            title={emptyTitle}
            description={emptyDescription}
            className="mt-8"
        />
    );

    return (
        <FlashList
            className="bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="pt-4 pb-8"
            data={items ?? []}
            keyExtractor={(comment) => comment.reference}
            renderItem={({ item }) => <UserCommentRow comment={item} />}
            ListHeaderComponent={header}
            ListEmptyComponent={empty}
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
    );
};

export default CommentFeedList;
