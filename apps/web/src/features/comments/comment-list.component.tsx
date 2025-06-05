'use client';

import { CommentsContentType } from '@hikka/client';
import { useCommentThread, useContentComments, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import CommentsProvider from '@/services/providers/comments-provider';

import CommentInput from '../../components/comments/comment-input';
import Comments from '../../components/comments/comments';
import LoadMoreButton from '../../components/load-more-button';

interface Props {
    slug: string;
    content_type: CommentsContentType;
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
    } = useContentComments({
        contentType: content_type,
        slug,
        options: {
            enabled: !comment_reference,
        },
    });

    const { data: thread } = useCommentThread({
        commentReference: String(comment_reference),
        options: { enabled: !!comment_reference },
    });

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
            <Header>
                <HeaderContainer>
                    <HeaderTitle>{title}</HeaderTitle>
                    {comment_reference && (
                        <Button size="md" variant="outline">
                            <Link href={`/comments/${content_type}/${slug}`}>
                                Всі коментарі
                            </Link>
                        </Button>
                    )}
                </HeaderContainer>
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
