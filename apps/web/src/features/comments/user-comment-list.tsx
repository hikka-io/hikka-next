import { type FC, useState } from 'react';

import { Star } from 'lucide-react';

import { getCommentsUserInfiniteOptions } from '@hikka/api';

import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { ChipTabs } from '@/components/ui/chip-tabs';
import EmptyState from '@/components/ui/empty-state';
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
} & CommentSortProps;

const UserCommentList: FC<Props> = ({
    username,
    className,
    commentType: controlledCommentType,
    onCommentTypeChange,
    ...sortProps
}) => {
    const [localCommentType, setLocalCommentType] =
        useState<CommentType>('all');
    const commentType = controlledCommentType ?? localCommentType;
    const setCommentType = onCommentTypeChange ?? setLocalCommentType;
    const { sort, order, setSort, setOrder } = useCommentSort(sortProps);
    const {
        list,
        pagination,
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
            },
        }),
    );

    return (
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header>
                <HeaderContainer className="min-w-0">
                    <HeaderTitle truncate>
                        <span>
                            Обговорення{' '}
                            {pagination && (
                                <span className="text-muted-foreground">
                                    ({pagination.total})
                                </span>
                            )}
                        </span>
                    </HeaderTitle>
                </HeaderContainer>
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
                <HeaderNavButton />
            </Header>
            <CommentsProvider>
                <div className="flex flex-col gap-6">
                    <ChipTabs
                        options={COMMENT_TYPE_OPTIONS}
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
