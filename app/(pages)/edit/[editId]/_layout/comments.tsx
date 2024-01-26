'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import CommentInput from '@/app/_components/comment-input';
import Comments from '@/app/_components/comments';
import SubHeader from '@/app/_components/sub-header';
import getComments, { Response } from '@/utils/api/comments/getComments';
import CommentsProvider from '@/utils/providers/comments-provider';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/app/_components/ui/button';


const Component = () => {
    const { ref, inView } = useInView();
    const params = useParams();

    const { data: comments, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['comments', params.editId],
        queryFn: ({ pageParam }) =>
            getComments({
                slug: String(params.editId),
                content_type: 'edit',
                page: pageParam
            }),
        getNextPageParam: (lastPage: Response) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        gcTime: 0,
        staleTime: 0,
    });

    useEffect(() => {
        if (inView && comments) {
            fetchNextPage();
        }
    }, [inView]);

    const list = comments?.pages.map((data) => data.list).flat(1);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Коментарі" />

            <div className="flex flex-col gap-4">
                <CommentInput slug={String(params.editId)} content_type={'edit'} />
                {list && (
                    <CommentsProvider>
                        <Comments
                            slug={String(params.editId)}
                            content_type={'edit'}
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