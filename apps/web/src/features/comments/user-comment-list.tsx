import { type FC, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';

import {
    getCommentsUserInfiniteOptions,
    serviceUserStatsOptions,
} from '@hikka/api';

import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Checkbox } from '@/components/ui/checkbox';
import { ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
import { Field, FieldLabel, FieldTitle } from '@/components/ui/field';
import {
    Header,
    HeaderActions,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Sort from '@/features/filters/sort';
import CommentsProvider from '@/services/providers/comments-provider';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';

import { COMMENT_TYPE_OPTIONS, type CommentType } from './comment-list';
import { CommentListSkeleton } from './comment-skeleton';
import { type CommentSortProps, useCommentSort } from './hooks';
import UserComment from './user-comment';
import { getCommentSort } from './utils/comment-sort';

type Props = {
    username: string;
    className?: string;
    commentType?: CommentType;
    onCommentTypeChange?: (type: CommentType) => void;
    firstLevelOnly?: boolean;
    onFirstLevelOnlyChange?: (value: boolean) => void;
} & CommentSortProps;

const UserCommentList: FC<Props> = ({
    username,
    className,
    commentType: controlledCommentType,
    onCommentTypeChange,
    firstLevelOnly: controlledFirstLevelOnly,
    onFirstLevelOnlyChange,
    ...sortProps
}) => {
    const [localCommentType, setLocalCommentType] =
        useState<CommentType>('all');
    const [localFirstLevelOnly, setLocalFirstLevelOnly] = useState(false);
    const commentType = controlledCommentType ?? localCommentType;
    const setCommentType = onCommentTypeChange ?? setLocalCommentType;
    const firstLevelOnly = controlledFirstLevelOnly ?? localFirstLevelOnly;
    const setFirstLevelOnly = onFirstLevelOnlyChange ?? setLocalFirstLevelOnly;
    const { sort, order, setSort, setOrder } = useCommentSort(sortProps);
    const { data: stats } = useQuery(
        serviceUserStatsOptions({ path: { username } }),
    );

    const chipOptions = useMemo(() => {
        const reviews = stats?.reviews_count ?? 0;
        const comments = (stats?.comments_count ?? 0) - reviews;

        const total = reviews + comments;

        if (total === 0) return COMMENT_TYPE_OPTIONS;

        const counts: Record<CommentType, number> = {
            all: total,
            comment: comments,
            review: reviews,
        };

        return COMMENT_TYPE_OPTIONS.map((option) => ({
            ...option,
            count: counts[option.value],
        }));
    }, [stats]);

    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        ref,
    } = useInfiniteList(
        getCommentsUserInfiniteOptions({
            path: { username },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                first_level_only: firstLevelOnly || undefined,
            },
        }),
    );

    return (
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header className="flex-wrap">
                <HeaderContainer className="min-w-0 max-md:w-full">
                    <HeaderTitle truncate>Обговорення</HeaderTitle>
                </HeaderContainer>
                <HeaderActions className="max-md:w-full max-md:justify-between">
                    <FieldLabel className="h-8 w-fit! shrink-0 cursor-pointer">
                        <Field
                            orientation="horizontal"
                            className="h-full items-center"
                        >
                            <Checkbox
                                checked={firstLevelOnly}
                                onCheckedChange={(checked) =>
                                    setFirstLevelOnly(checked === true)
                                }
                                id="first-level-only"
                                name="first-level-only"
                            />
                            <FieldTitle className="whitespace-nowrap font-normal text-muted-foreground text-sm">
                                Без відповідей
                            </FieldTitle>
                        </Field>
                    </FieldLabel>
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
                <HeaderNavButton />
            </Header>
            <CommentsProvider>
                <div className="flex flex-col gap-6">
                    <ChipTabs
                        options={chipOptions}
                        value={commentType}
                        onValueChange={setCommentType}
                    />
                    {isLoading && <CommentListSkeleton />}
                    {list &&
                        list.length === 0 &&
                        (commentType === 'review' ? (
                            <EmptyState
                                bordered
                                icon={<Star />}
                                title={<span>Відгуків не знайдено</span>}
                                description="Тут з'являться відгуки, щойно користувач поділиться враженнями"
                            />
                        ) : (
                            <EmptyState
                                bordered
                                icon={<MaterialSymbolsAddCommentRounded />}
                                title={<span>Коментарів не знайдено</span>}
                                description="Тут з'являться коментарі користувача"
                            />
                        ))}
                    {list && list.length > 0 && (
                        <div className="flex w-full flex-col gap-6">
                            {list.map((comment) => (
                                <UserComment
                                    key={comment.reference}
                                    comment={comment}
                                />
                            ))}
                        </div>
                    )}
                    {hasNextPage && (
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    )}
                </div>
            </CommentsProvider>
        </Block>
    );
};

export default UserCommentList;
