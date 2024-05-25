import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import ContentHeader from '@/features/comments/comment-content-header.component';
import Content from '@/features/comments/comment-content.component';
import Comments from '@/features/comments/comment-list/comment-list.component';
import { getContent } from '@/features/comments/useContent';

import getCommentThread from '@/services/api/comments/getCommentThread';
import getComments from '@/services/api/comments/getComments';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: `Коментарі`,
    });
}

interface Props {
    params: {
        content_type: API.ContentType;
        slug: string;
        comment_reference: string[];
    };
}

const CommentsPage: FC<Props> = async ({ params }) => {
    const queryClient = await getQueryClient();

    const comment_reference =
        params.comment_reference && params.comment_reference[0];

    await queryClient.prefetchQuery({
        queryKey: ['content', params.content_type, params.slug],
        queryFn: async () =>
            getContent({
                content_type: params.content_type,
                slug: params.slug,
            }),
    });

    const content = queryClient.getQueryData([
        'content',
        params.content_type,
        params.slug,
    ]);

    if (!content) {
        return redirect('/');
    }

    !comment_reference &&
        (await queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['comments', params.slug, params.content_type],
            queryFn: ({ pageParam, meta }) =>
                getComments({
                    params: {
                        slug: params.slug,
                        content_type: params.content_type,
                    },
                    page: pageParam,
                }),
        }));

    comment_reference &&
        (await queryClient.prefetchQuery({
            queryKey: ['commentThread', comment_reference],
            queryFn: ({ meta }) =>
                getCommentThread({
                    params: {
                        reference: comment_reference,
                    },
                }),
        }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_25%]">
                <div className="flex flex-col gap-16">
                    <ContentHeader
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                    <Comments
                        comment_reference={comment_reference}
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                </div>
                <Content
                    content_type={params.content_type}
                    slug={params.slug}
                />
            </div>
        </HydrationBoundary>
    );
};

export default CommentsPage;
