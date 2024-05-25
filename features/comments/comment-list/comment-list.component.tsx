'use client';

import Link from 'next/link';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import CommentInput from '@/features/comments/comment-list/comment-input';
import Comments from '@/features/comments/comment-list/comments';

import useSession from '@/services/hooks/auth/useSession';
import useCommentThread from '@/services/hooks/comments/useCommentThread';
import useComments from '@/services/hooks/comments/useComments';
import CommentsProvider from '@/services/providers/comments-provider';

interface Props {
    slug: string;
    content_type: API.ContentType;
    comment_reference?: string;
}

const CommentList: FC<Props> = ({ slug, content_type, comment_reference }) => {
    const { user: loggedUser } = useSession();
    const {
        list: comments,
        pagination,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        ref,
    } = useComments({ slug, content_type }, { enabled: !comment_reference });

    const { data: thread } = useCommentThread(
        {
            reference: String(comment_reference),
        },
        { enabled: !!comment_reference },
    );

    const list = comment_reference ? (thread ? [thread] : []) : comments;

    const title = (
        <span>
            Обговорення{' '}
            {pagination && !comment_reference && (
                <span className="text-muted-foreground">
                    ({pagination.total})
                </span>
            )}
        </span>
    );

    return (
        <Block>
            <Header title={title}>
                {comment_reference && (
                    <Button size="sm" variant="outline">
                        <Link href={`/comments/${content_type}/${slug}`}>
                            Всі коментарі
                        </Link>
                    </Button>
                )}
            </Header>
            <div className="flex flex-col gap-4">
                {loggedUser && !comment_reference && (
                    <CommentInput slug={slug} content_type={content_type} />
                )}
                {list && list.length === 0 && (
                    <NotFound
                        title={<span>Коментарів не знайдено</span>}
                        description="Ви можете розпочати обговорення першим"
                    />
                )}
                {list && (
                    <CommentsProvider>
                        <Comments
                            slug={slug}
                            content_type={content_type}
                            comments={list}
                        />
                    </CommentsProvider>
                )}
                {hasNextPage && (
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                )}
            </div>
        </Block>
    );
};

export default CommentList;
