'use client';

import React from 'react';

import CommentInput from '@/components/comments/components/comment-input';
import Comments from '@/components/comments/components/comments';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import getComments from '@/services/api/comments/getComments';
import useInfiniteList from '@/services/hooks/useInfiniteList';

import CommentsProvider from '@/services/providers/comments-provider';

interface Props {
    slug: string;
    content_type: API.ContentType;
    auth?: string;
}

const Component = ({ slug, content_type, auth }: Props) => {
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList({
            queryKey: ['comments', slug, content_type, { auth }],
            queryFn: ({ pageParam }) =>
                getComments({
                    slug,
                    content_type,
                    page: pageParam,
                    auth,
                }),
        });

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Обговорення" />

            <div className="flex flex-col gap-4">
                {auth && (
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
                    <Button
                        variant="secondary"
                        ref={ref}
                        disabled={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        {isFetchingNextPage && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Завантажити ще
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Component;
