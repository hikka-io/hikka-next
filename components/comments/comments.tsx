'use client';

import React, { FC } from 'react';

import CommentInput from '@/components/comments/components/comment-input';
import Comments from '@/components/comments/components/comments';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import useSession from '@/services/hooks/auth/useSession';
import useComments from '@/services/hooks/comments/useComments';
import CommentsProvider from '@/services/providers/comments-provider';

interface Props {
    slug: string;
    content_type: API.ContentType;
}

const CommentsBlock: FC<Props> = ({ slug, content_type }) => {
    const { user: loggedUser } = useSession();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useComments({ slug, content_type });

    return (
        <Block>
            <Header title="Обговорення" />
            <div className="flex flex-col gap-4">
                {loggedUser && (
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

export default CommentsBlock;
