import { type FC, useMemo, useState } from 'react';

import { clamp } from '@antfu/utils';
import { Star } from 'lucide-react';

import type { CommentContentTypeEnum, CommentTypeEnum } from '@hikka/api';

import AntDesignArrowDownOutlined from '@/components/icons/ant-design/AntDesignArrowDownOutlined';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderActions,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginButton } from '@/features/auth';
import { Sort } from '@/features/filters';
import { useVisibleOnce } from '@/services/hooks/use-visible-once';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import CommentInput from './comment-input';
import { CommentListSkeleton } from './comment-skeleton';
import CommentTree from './comment-tree';
import { COMMENT_TYPE_OPTIONS } from './comment-type-options';
import CommentsProvider from './comments-provider';
import { COMMENT_PREVIEW_SIZE, commentListOptions } from './queries';
import { getReviewTotal, supportsReviews, type Verdict } from './review/review';
import ReviewStatsCard from './review/review-stats-card';
import { useReviewStats } from './review/use-review-stats';
import { type CommentSortProps, useCommentSort } from './use-comment-sort';
import { useCommentThread } from './use-comment-thread';
import { buildCommentTree, type CommentNode } from './utils/build-comment-tree';

type Props = {
    slug: string;
    content_type: CommentContentTypeEnum;
    comment_reference?: string;
    preview?: boolean;
    className?: string;
    contentTitle?: string;
    commentType?: CommentTypeEnum;
    onCommentTypeChange?: (type: CommentTypeEnum) => void;
    verdict?: Verdict | null;
    onVerdictChange?: (verdict: Verdict | null) => void;
} & CommentSortProps;

const CommentList: FC<Props> = ({
    slug,
    content_type,
    comment_reference,
    preview,
    className,
    contentTitle,
    commentType: controlledCommentType,
    onCommentTypeChange,
    verdict: controlledVerdict,
    onVerdictChange,
    ...sortProps
}) => {
    const { user: loggedUser } = useSession();
    const hasReviews = supportsReviews(content_type);
    const [localCommentType, setLocalCommentType] =
        useState<CommentTypeEnum>('all');
    const [localVerdict, setLocalVerdict] = useState<Verdict | null>(null);
    const commentType = controlledCommentType ?? localCommentType;
    // `!== undefined`, not `??`: `null` is a valid controlled value meaning
    // "no filter", and must not fall through to local state.
    const verdict =
        controlledVerdict !== undefined ? controlledVerdict : localVerdict;

    const setCommentType = (type: CommentTypeEnum) => {
        if (onCommentTypeChange) {
            onCommentTypeChange(type);
        } else {
            setLocalCommentType(type);
        }
        if (!onVerdictChange && type !== 'review') setLocalVerdict(null);
    };

    const setVerdict = (next: Verdict | null) => {
        if (onVerdictChange) {
            onVerdictChange(next);
            return;
        }
        setLocalVerdict(next);
        setCommentType('review');
    };

    const { sort, order, setSort, setOrder } = useCommentSort(sortProps);
    const { stats, commentsCount } = useReviewStats({ content_type, slug });
    const reviewsTotal = getReviewTotal(stats);

    const chipOptions = useMemo(() => {
        if (commentsCount === undefined) return COMMENT_TYPE_OPTIONS;

        // `comments_count` already includes reviews, so the plain comment count
        // is the remainder. Clamped: the two numbers come from different
        // snapshots of the same content and can disagree briefly.
        const counts: Record<CommentTypeEnum, number> = {
            all: commentsCount,
            comment: Math.max(commentsCount - reviewsTotal, 0),
            review: reviewsTotal,
        };

        return COMMENT_TYPE_OPTIONS.map((option) => ({
            ...option,
            count: counts[option.value],
        }));
    }, [commentsCount, reviewsTotal]);

    const showTypeTabs = hasReviews && !comment_reference;

    const previewTotal =
        preview && !verdict
            ? chipOptions.find((option) => option.value === commentType)?.count
            : undefined;

    const reviewStats =
        showTypeTabs && commentType !== 'comment' && reviewsTotal > 0
            ? stats
            : undefined;

    const { ref: visibleRef, visible } = useVisibleOnce();
    const deferred = !!preview && !comment_reference;

    const listQuery = useInfiniteList(
        commentListOptions(content_type, slug, {
            commentType,
            sort,
            order,
            verdict,
            preview,
        }),
        { enabled: !comment_reference && (!deferred || visible) },
    );

    const threadQuery = useCommentThread(
        comment_reference,
        !!comment_reference,
    );

    const {
        list: rows,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isFetchingList,
        ref,
    } = comment_reference ? threadQuery : listQuery;
    const isLoading = isFetchingList || (deferred && listQuery.isPending);

    // Content types without review chips have no other place to show a total.
    const headerTotal =
        !showTypeTabs && !comment_reference ? pagination?.total : undefined;

    // Carry the preview block's filter over to the full page.
    const allCommentsSearch = {
        ...(commentType !== 'all' && { comment_type: commentType }),
        ...(commentType === 'review' && verdict && { recommended: verdict }),
    };

    const list: CommentNode[] | undefined = useMemo(
        () => (rows ? buildCommentTree(rows) : isLoading ? undefined : []),
        [rows, isLoading],
    );

    return (
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header href={`/comments/${content_type}/${slug}`}>
                <HeaderContainer className="min-w-0">
                    <HeaderTitle truncate>
                        Обговорення{' '}
                        {headerTotal !== undefined && (
                            <span className="text-muted-foreground">
                                ({headerTotal})
                            </span>
                        )}
                    </HeaderTitle>
                    {comment_reference && (
                        <Button size="md" variant="outline">
                            <Link to={`/comments/${content_type}/${slug}`}>
                                Усі коментарі
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
                {!comment_reference && (
                    <HeaderActions>
                        <Sort
                            sort_type="comment"
                            compact
                            size="sm"
                            placeholder="Сортування"
                            className="w-32 md:w-48"
                            sort={sort}
                            order={order}
                            onSortChange={setSort}
                            onOrderChange={setOrder}
                        />
                    </HeaderActions>
                )}
                <HeaderNavButton />
            </Header>
            <CommentsProvider lazyThread={!comment_reference}>
                <div ref={visibleRef} className="flex flex-col gap-4">
                    {showTypeTabs && (
                        <ChipTabs
                            options={chipOptions}
                            value={commentType}
                            onValueChange={setCommentType}
                        />
                    )}
                    {reviewStats && (
                        <ReviewStatsCard
                            stats={reviewStats}
                            value={verdict}
                            onChange={setVerdict}
                        />
                    )}
                    {!loggedUser && (
                        <EmptyState
                            bordered
                            icon={<MaterialSymbolsLockOpenRounded />}
                            title={<span>Ви не авторизовані</span>}
                            description="Увійдіть у свій акаунт, щоб залишити коментар"
                            action={
                                <LoginButton
                                    variant="default"
                                    size="md"
                                    className="w-full lg:w-auto"
                                />
                            }
                        />
                    )}
                    {loggedUser && !comment_reference && (
                        <CommentInput
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            forceReview={
                                hasReviews
                                    ? commentType === 'review'
                                    : undefined
                            }
                        />
                    )}
                    {isLoading && (
                        <CommentListSkeleton
                            count={
                                previewTotal === undefined
                                    ? undefined
                                    : clamp(
                                          previewTotal,
                                          1,
                                          COMMENT_PREVIEW_SIZE,
                                      )
                            }
                        />
                    )}
                    {isLoading && preview && previewTotal !== 0 && (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    )}
                    {list &&
                        list.length === 0 &&
                        (commentType === 'review' ? (
                            <EmptyState
                                bordered
                                icon={<Star />}
                                title={<span>Відгуків не знайдено</span>}
                                description={
                                    verdict
                                        ? 'Немає відгуків із цією оцінкою'
                                        : "Тут з'являться відгуки, щойно хтось поділиться враженнями"
                                }
                            />
                        ) : (
                            <EmptyState
                                bordered
                                icon={<MaterialSymbolsAddCommentRounded />}
                                title={<span>Коментарів не знайдено</span>}
                                description="Ви можете розпочати обговорення першим"
                            />
                        ))}
                    {list && (
                        <CommentTree
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            comments={list}
                        />
                    )}
                    {hasNextPage && !preview && (
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    )}
                    {list && list.length !== 0 && preview && (
                        <Button
                            variant="outline"
                            render={
                                <Link
                                    to={`/comments/${content_type}/${slug}`}
                                    search={allCommentsSearch}
                                />
                            }
                        >
                            <AntDesignArrowDownOutlined />
                            Переглянути всі
                        </Button>
                    )}
                </div>
            </CommentsProvider>
        </Block>
    );
};

export default CommentList;
