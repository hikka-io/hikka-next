'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CommentInput from '@/app/_components/comments/comment-input';
import Comments from '@/app/_components/comments/comments';
import SubHeader from '@/app/_components/sub-header';
import { Button } from '@/app/_components/ui/button';
import getComments from '@/utils/api/comments/getComments';
import useInfiniteList from '@/utils/hooks/useInfiniteList';
import { useAuthContext } from '@/utils/providers/auth-provider';
import CommentsProvider from '@/utils/providers/comments-provider';

interface Props {
    slug: string;
    content_type: Hikka.ContentType;
}

const Component = ({ slug, content_type }: Props) => {
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['comments', slug, content_type],
            queryFn: ({ pageParam }) =>
                getComments({
                    slug,
                    content_type,
                    page: pageParam,
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
                {secret && <CommentInput slug={slug} content_type={content_type} />}
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