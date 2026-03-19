import { CommentsContentType } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import { contentCommentsOptions } from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { CommentList as Comments, prefetchContent } from '@/features/comments';
import ContentHeader from '@/features/comments/content-header';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/')({
    loader: async ({ params, context: { queryClient, hikkaClient } }) => {
        const { content_type, slug } = params;

        const content = await prefetchContent({
            content_type: content_type as CommentsContentType,
            slug,
            queryClient,
            hikkaClient,
        });

        if (!content) throw redirect({ to: '/' });

        await prefetchInfiniteQuery(
            queryClient,
            contentCommentsOptions(hikkaClient, {
                contentType: content_type as CommentsContentType,
                slug,
            }),
        );

        return { content };
    },
    head: ({ loaderData }) => {
        const content = loaderData?.content as Record<string, any> | undefined;
        const title =
            content?.title_ua ||
            content?.title_en ||
            content?.title_ja ||
            content?.title ||
            content?.name_ua ||
            content?.name_en;

        return generateHeadMeta({
            title: title ? `Коментарі / ${title}` : 'Коментарі',
        });
    },
    component: CommentsPage,
});

function CommentsPage() {
    const { content_type, slug } = Route.useParams();

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
                />
            </div>
        </div>
    );
}
