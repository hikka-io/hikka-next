'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CommentInput from '@/components/comments/ui/comment-input';
import Comments from '@/components/comments/ui/comments';
import NotFound from '@/components/ui/not-found';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import getComments from '@/services/api/comments/getComments';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';
import CommentsProvider from '@/services/providers/comments-provider';

interface Props {
    slug: string;
    content_type: Hikka.ContentType;
}

const Component = ({ slug, content_type }: Props) => {
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['comments', slug, content_type, secret],
            queryFn: ({ pageParam }) =>
                getComments({
                    slug,
                    content_type,
                    page: pageParam,
                    secret,
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Обговорення" />

            <div className="flex flex-col gap-4">
                {secret && (
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