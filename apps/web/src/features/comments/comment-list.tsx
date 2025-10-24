'use client';

import { CommentsContentType } from '@hikka/client';
import { useCommentThread, useContentComments, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import CommentInput from '@/components/comments/comment-input';
import Comments from '@/components/comments/comments';
import AntDesignArrowDownOutlined from '@/components/icons/ant-design/AntDesignArrowDownOutlined';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import { LoginButton } from '@/features/common';

import CommentsProvider from '@/services/providers/comments-provider';
import { cn } from '@/utils/utils';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    comment_reference?: string;
    preview?: boolean;
    className?: string;
}

const CommentList: FC<Props> = ({
    slug,
    content_type,
    comment_reference,
    preview,
    className,
}) => {
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
        paginationArgs: preview ? { size: 3 } : undefined,
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
        <Block className={cn('break-inside-avoid', className)} id="comments">
            <Header href={`/comments/${content_type}/${slug}`}>
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
                <HeaderNavButton />
            </Header>
            <div className="flex flex-col gap-4">
                {!loggedUser && (
                    <NotFound
                        title={<span>Ви не авторизовані</span>}
                        description="Увійдіть у свій акаунт, щоб залишити коментар"
                    >
                        <LoginButton
                            variant="default"
                            size="md"
                            className="w-full lg:w-auto"
                            asChild
                        />
                    </NotFound>
                )}
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
                {hasNextPage && !preview && (
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                )}
                {list && list.length !== 0 && preview && (
                    <Button variant="outline" asChild>
                        <Link href={`/comments/${content_type}/${slug}`}>
                            <AntDesignArrowDownOutlined />
                            Переглянути всі
                        </Link>
                    </Button>
                )}
            </div>
        </Block>
    );
};

export default CommentList;
