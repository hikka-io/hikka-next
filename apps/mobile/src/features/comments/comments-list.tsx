import { type FC, useMemo, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LockOpen, MessageSquarePlus, Star } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import {
    type CommentContentTypeEnum,
    type CommentResponse,
    type CommentTypeEnum,
    MainContentTypeEnum,
} from '@hikka/api';
import {
    buildCommentTree,
    COMMENT_LIST_IDS,
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
    getReviewTotal,
    queryId,
    supportsReviews,
} from '@hikka/core';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSession } from '@/features/auth';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { usePullToRefresh } from '@/utils/api/use-pull-to-refresh';

import { composerHref, threadHref } from './comment-routes';
import CommentRow from './comment-row';
import { defaultExpanded, flattenCommentRows } from './comment-rows';
import CommentSkeleton from './comment-skeleton';
import CommentSortMenu from './comment-sort-menu';
import { useCommentTreeStore } from './comment-tree-store';
import CommentTypeChips from './comment-type-chips';
import {
    COMMENT_PREVIEW_SIZE,
    commentListOptions,
    commentStatsOptions,
    commentThreadOptions,
} from './queries';

const LIST_IDS = new Set<string>(COMMENT_LIST_IDS);
const isMainContent = (type: string): type is MainContentTypeEnum =>
    (Object.values(MainContentTypeEnum) as string[]).includes(type);

type Props = {
    contentType: CommentContentTypeEnum;
    slug: string;
    /** A single thread: the comment and everything under it. */
    reference?: string;
};

/** The web's `CommentList` page: a content's discussion, or one thread when `reference` is set. */
const CommentsList: FC<Props> = ({ contentType, slug, reference }) => {
    const router = useRouter();
    const { hasToken } = useSession();
    const [sort, setSort] = useState<string>(DEFAULT_COMMENT_SORT);
    const [order, setOrder] = useState<CommentOrder>(DEFAULT_COMMENT_ORDER);
    const [commentType, setCommentType] = useState<CommentTypeEnum>('all');
    const expanded = useCommentTreeStore((state) => state.expanded);
    const { refreshing, onRefresh } = usePullToRefresh((query) =>
        LIST_IDS.has(queryId(query.queryKey) ?? ''),
    );

    const showTypes = !reference && supportsReviews(contentType);
    const { data: stats } = useQuery({
        ...commentStatsOptions(
            isMainContent(contentType)
                ? contentType
                : MainContentTypeEnum.ANIME,
            slug,
        ),
        enabled: showTypes,
    });

    const { items, error, isFetchingNextPage, onEndReached, onRetry } =
        useInfiniteList<CommentResponse>(
            reference
                ? commentThreadOptions(reference)
                : commentListOptions(contentType, slug, {
                      commentType,
                      sort,
                      order,
                  }),
        );

    const rows = useMemo(
        () =>
            items
                ? flattenCommentRows(buildCommentTree(items), {
                      isExpanded: (node, depth) =>
                          expanded[node.reference] ?? defaultExpanded(depth),
                      showMissing: !reference,
                  })
                : undefined,
        [items, expanded, reference],
    );

    const compose = () => {
        if (!hasToken) {
            router.push('/login');
            return;
        }
        router.push(
            composerHref({
                contentType,
                slug,
                review: commentType === 'review',
            }),
        );
    };

    const header = (
        <View className="gap-4 px-4 pt-4 pb-6">
            {reference ? (
                <Button
                    variant="outline"
                    size="md"
                    containerClassName="self-start"
                    onPress={() => router.push(threadHref(contentType, slug))}
                >
                    Усі коментарі
                </Button>
            ) : (
                <>
                    {showTypes && (
                        <CommentTypeChips
                            value={commentType}
                            onChange={setCommentType}
                            commentsCount={stats?.commentsCount}
                            reviewsCount={getReviewTotal(stats?.reviewStats)}
                        />
                    )}
                    {hasToken ? (
                        <Pressable
                            accessibilityRole="button"
                            onPress={compose}
                            className="min-h-12 flex-row items-center gap-3 rounded-lg border border-border bg-secondary/20 px-4 active:opacity-70"
                        >
                            <Icon
                                as={MessageSquarePlus}
                                className="text-muted-foreground"
                            />
                            <Text className="text-muted-foreground text-sm">
                                {commentType === 'review'
                                    ? 'Поділіться враженнями від тайтлу…'
                                    : 'Напишіть повідомлення...'}
                            </Text>
                        </Pressable>
                    ) : (
                        <EmptyState
                            bordered
                            size="sm"
                            icon={<Icon as={LockOpen} />}
                            title="Ви не авторизовані"
                            description="Увійдіть у свій акаунт, щоб залишити коментар"
                            action={
                                <Button
                                    size="md"
                                    onPress={() => router.push('/login')}
                                >
                                    Увійти
                                </Button>
                            }
                        />
                    )}
                </>
            )}
        </View>
    );

    const empty = !rows ? (
        error ? (
            <ErrorState error={error} onRetry={onRetry} className="pt-8" />
        ) : (
            <View className="gap-6 px-4">
                {Array.from({ length: COMMENT_PREVIEW_SIZE }, (_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders.
                    <CommentSkeleton key={index} />
                ))}
            </View>
        )
    ) : commentType === 'review' ? (
        <EmptyState
            bordered
            icon={<Icon as={Star} />}
            title="Відгуків не знайдено"
            description="Тут з'являться відгуки, щойно хтось поділиться враженнями"
            className="mx-4"
        />
    ) : (
        <EmptyState
            bordered
            icon={<Icon as={MessageSquarePlus} />}
            title="Коментарів не знайдено"
            description="Ви можете розпочати обговорення першим"
            className="mx-4"
        />
    );

    return (
        <>
            {!reference && (
                <CommentSortMenu
                    sort={sort}
                    order={order}
                    onSortChange={setSort}
                    onOrderChange={setOrder}
                />
            )}
            <FlashList
                className="bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="pb-16"
                data={rows ?? []}
                keyExtractor={(row) => row.key}
                getItemType={(row) => row.type}
                renderItem={({ item }) => <CommentRow row={item} slug={slug} />}
                ListHeaderComponent={header}
                ListEmptyComponent={empty}
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

export default CommentsList;
