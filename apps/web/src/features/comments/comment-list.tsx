import { type FC, useMemo, useState } from 'react';

import { LayoutGrid, MessageCircle, Star } from 'lucide-react';

import {
    type CommentContentTypeEnum as CommentsContentType,
    getCommentsListInfiniteOptions,
} from '@hikka/api';

import AntDesignArrowDownOutlined from '@/components/icons/ant-design/AntDesignArrowDownOutlined';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderActions,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { LoginButton } from '@/features/app-shell';
import { useSession } from '@/features/auth/hooks/use-session';
import Sort from '@/features/filters/sort';
import CommentsProvider from '@/services/providers/comments-provider';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import CommentInput from './comment-input';
import { CommentListSkeleton } from './comment-skeleton';
import Comments from './comments';
import {
    type CommentSortProps,
    useCommentSort,
    useCommentThread,
    useReviewStats,
} from './hooks';
import ReviewStatsCard from './review-stats-card';
import { buildCommentTree, type CommentNode } from './utils/build-comment-tree';
import { getCommentSort } from './utils/comment-sort';
import { getReviewTotal, supportsReviews, type Verdict } from './utils/review';

export type CommentType = 'all' | 'comment' | 'review';

export const COMMENT_TYPE_OPTIONS: ChipTabOption<CommentType>[] = [
    {
        label: 'Усі',
        value: 'all',
        icon: LayoutGrid,
    },
    {
        label: 'Коментарі',
        value: 'comment',
        icon: MessageCircle,
        activeClass:
            'border border-feed-comment/40 bg-feed-comment/15 text-feed-comment',
    },
    {
        label: 'Відгуки',
        value: 'review',
        icon: Star,
        activeClass:
            'border border-feed-review/40 bg-feed-review/15 text-feed-review',
    },
];

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment_reference?: string;
    preview?: boolean;
    className?: string;
    contentTitle?: string;
    commentType?: CommentType;
    onCommentTypeChange?: (type: CommentType) => void;
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
        useState<CommentType>('all');
    const [localVerdict, setLocalVerdict] = useState<Verdict | null>(null);
    const commentType = controlledCommentType ?? localCommentType;
    // `!== undefined`, not `??`: `null` is a valid controlled value meaning
    // "no filter", and must not fall through to local state.
    const verdict =
        controlledVerdict !== undefined ? controlledVerdict : localVerdict;

    const setCommentType = (type: CommentType) => {
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
        const counts: Record<CommentType, number> = {
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

    const reviewStats =
        showTypeTabs && commentType !== 'comment' && reviewsTotal > 0
            ? stats
            : undefined;

    const listQuery = useInfiniteList(
        getCommentsListInfiniteOptions({
            path: { content_type, slug },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                // `undefined`, never `null`: keeps the unfiltered query key
                // identical to the one the content-page loaders prefetch.
                recommended:
                    commentType === 'review'
                        ? (verdict ?? undefined)
                        : undefined,
            },
            query: preview ? { size: 3 } : undefined,
        }),
        { enabled: !comment_reference },
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
        isLoading,
        ref,
    } = comment_reference ? threadQuery : listQuery;

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
                <div className="flex flex-col gap-4">
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
                                    asChild
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
                    {isLoading && <CommentListSkeleton />}
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
                        <Comments
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
                        <Button variant="outline" asChild>
                            <Link
                                to={`/comments/${content_type}/${slug}`}
                                search={allCommentsSearch}
                            >
                                <AntDesignArrowDownOutlined />
                                Переглянути всі
                            </Link>
                        </Button>
                    )}
                </div>
            </CommentsProvider>
        </Block>
    );
};

export default CommentList;
