'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import CommentInput from '@/app/_components/comment-input';
import Comments from '@/app/_components/comments';
import getComments from '@/utils/api/comments/getComments';
import SubHeader from '@/app/_components/sub-header';


const Component = () => {
    const params = useParams();

    const { data: comments } = useQuery({
        queryKey: ['comments', params.editId],
        queryFn: () =>
            getComments({
                slug: String(params.editId),
                content_type: 'edit',
            }),
    });

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Коментарі"/>
            <CommentInput slug={String(params.editId)} content_type={'edit'} />
            {comments && <Comments slug={String(params.editId)} content_type={'edit'} comments={comments.list} />}
        </div>
    );
};

export default Component;