import { type FC, useMemo, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LockOpen, MessageSquarePlus, Star } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';

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
    type Verdict,
} from '@hikka/core';

import ListFooter from '@/components/list-footer';
import NsfwGate from '@/components/nsfw-gate';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { SignInPrompt, useSession } from '@/features/auth';
import { useNsfwAllowed } from '@/services/session';
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
import ReviewStatsCard from './review-stats-card';

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
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const expanded = useCommentTreeStore((state) => state.expanded);
    const { refreshing, onRefresh } = usePullToRefresh((query) =>
        LIST_IDS.has(queryId(query.queryKey) ?? ''),
    );

    const mainContent = isMainContent(contentType);
    const showTypes = !reference && supportsReviews(contentType);
    const nsfw = useNsfwAllowed();
    const {
        data: stats,
        isPending: statsPending,
        isError: statsError,
    } = useQuery({
        ...commentStatsOptions(
            isMainContent(contentType)
                ? contentType
                : MainContentTypeEnum.ANIME,
            slug,
        ),
        enabled: mainContent,
    });
    // A deep link can open an 18+ title's discussion directly, so it shares the detail page's gate.
    const gated = !!stats?.nsfw && !nsfw.allowed;
    const deciding =
        mainContent &&
        ((statsPending && !statsError) || (gated && nsfw.isPending));

    const {
        items,
        error,
        isFetchingNextPage,
        isFetchNextPageError,
        onRetryNextPage,
        onEndReached,
        onRetry,
    } = useInfiniteList<CommentResponse>(
        reference
            ? commentThreadOptions(reference)
            : commentListOptions(contentType, slug, {
                  commentType,
                  sort,
                  order,
                  verdict,
              }),
    );

    // Built apart from the flattening, so an expand or collapse keeps every node and the rows skip re-rendering their comments.
    const tree = useMemo(
        () => (items ? buildCommentTree(items) : undefined),
        [items],
    );
    const rows = useMemo(
        () =>
            tree
                ? flattenCommentRows(tree, {
                      isExpanded: (node, depth) =>
                          expanded[node.reference] ?? defaultExpanded(depth),
                      showMissing: !reference,
                  })
                : undefined,
        [tree, expanded, reference],
    );

    const reviewsTotal = getReviewTotal(stats?.reviewStats);
    const reviewStats =
        showTypes && commentType !== 'comment' && reviewsTotal > 0
            ? stats?.reviewStats
            : undefined;

    // The web's rule: picking a verdict shows reviews, leaving reviews drops the verdict.
    const changeType = (type: CommentTypeEnum) => {
        setCommentType(type);
        if (type !== 'review') setVerdict(null);
    };

    const changeVerdict = (next: Verdict | null) => {
        setVerdict(next);
        setCommentType('review');
    };

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
                            onChange={changeType}
                            commentsCount={stats?.commentsCount}
                            reviewsCount={reviewsTotal}
                        />
                    )}
                    {reviewStats && (
                        <ReviewStatsCard
                            stats={reviewStats}
                            value={verdict}
                            onChange={changeVerdict}
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
                                    ? 'Поділіться враженнями від тайтлу...'
                                    : 'Напишіть повідомлення...'}
                            </Text>
                        </Pressable>
                    ) : (
                        <SignInPrompt
                            variant="section"
                            icon={LockOpen}
                            description="Увійдіть у свій акаунт, щоб залишити коментар"
                        />
                    )}
                </>
            )}
        </View>
    );

    const empty =
        !rows || deciding ? (
            error ? (
                <ErrorState error={error} onRetry={onRetry} className="mt-8" />
            ) : (
                <View className="gap-6 px-4">
                    {Array.from(
                        { length: COMMENT_PREVIEW_SIZE },
                        (_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders.
                            <CommentSkeleton key={index} />
                        ),
                    )}
                </View>
            )
        ) : commentType === 'review' ? (
            <EmptyState
                icon={<Icon as={Star} />}
                title="Відгуків не знайдено"
                description="Тут зʼявляться відгуки, щойно хтось поділиться враженнями"
                className="mt-8"
            />
        ) : (
            <EmptyState
                icon={<Icon as={MessageSquarePlus} />}
                title="Коментарів не знайдено"
                description="Ви можете розпочати обговорення першим"
                className="mt-8"
            />
        );

    if (gated && !nsfw.isPending) {
        return (
            <ScrollView
                className="flex-1 bg-background"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="px-4 pt-4 pb-8"
            >
                <NsfwGate />
            </ScrollView>
        );
    }

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
                contentContainerClassName="pb-8"
                data={deciding ? [] : (rows ?? [])}
                keyExtractor={(row) => row.key}
                getItemType={(row) => row.type}
                renderItem={({ item }) => <CommentRow row={item} slug={slug} />}
                ListHeaderComponent={header}
                ListEmptyComponent={empty}
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
        </>
    );
};

export default CommentsList;
