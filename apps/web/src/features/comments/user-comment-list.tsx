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
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import CommentsProvider from '@/services/providers/comments-provider';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';

import { COMMENT_TYPE_OPTIONS, type CommentType } from './comment-list';
import { CommentListSkeleton } from './comment-skeleton';
import UserComment from './user-comment';

type Props = {
    username: string;
    className?: string;
    commentType?: CommentType;
    onCommentTypeChange?: (type: CommentType) => void;
};

const UserCommentList: FC<Props> = ({
    username,
    className,
    commentType: controlledCommentType,
    onCommentTypeChange,
}) => {
    const [localCommentType, setLocalCommentType] =
        useState<CommentType>('all');
    const commentType = controlledCommentType ?? localCommentType;
    const setCommentType = onCommentTypeChange ?? setLocalCommentType;
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
            query: { comment_type: commentType },
        }),
    );

    return (
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header>
                <HeaderContainer>
                    <HeaderTitle>
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
