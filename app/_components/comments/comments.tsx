'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CommentInput from '@/app/_components/comments/ui/comment-input';
import Comments from '@/app/_components/comments/ui/comments';
import NotFound from '@/app/_components/ui/not-found';
import SubHeader from '@/app/_components/sub-header';
import { Button } from '@/app/_components/ui/button';
import getComments from '@/app/_utils/api/comments/getComments';
import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import CommentsProvider from '@/app/_utils/providers/comments-provider';

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
                        Заванатажити ще
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Component;