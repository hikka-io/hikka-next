import { createFileRoute, redirect } from '@tanstack/react-router';

import {
    type CommentContentTypeEnum as CommentsContentType,
    getContentsListInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import { CommentList as Comments, prefetchContent } from '@/features/comments';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';
import { getTitle } from '@/utils/title/get-title';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { content_type, slug } = params;

        const content = await prefetchContent({
            content_type: content_type as CommentsContentType,
            slug,
            queryClient,
            apiClient,
        });

        if (!content) throw redirect({ to: '/' });

        await queryClient.prefetchInfiniteQuery({
            ...getContentsListInfiniteOptions({
                path: {
                    content_type: content_type as CommentsContentType,
                    slug,
                },
                client: apiClient,
            }),
            ...paginationPageParam(),
        });

        return { content };
    },
    head: ({ loaderData }) => {
        const content = loaderData?.content as Record<string, any> | undefined;
        const title = getTitle(content);

        return generateHeadMeta({
            title: title ? `Коментарі / ${title}` : 'Коментарі',
        });
    },
    component: CommentsPage,
});

function CommentsPage() {
    const { content_type, slug } = Route.useParams();
    const { content } = Route.useLoaderData();
    const contentTitle = getTitle(content) ?? undefined;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    slug={slug}
                    content_type={content_type as CommentsContentType}
                />
                <Comments
                    slug={slug}
                    content_type={content_type as CommentsContentType}
                    contentTitle={contentTitle}
                />
            </div>
        </div>
    );
}
