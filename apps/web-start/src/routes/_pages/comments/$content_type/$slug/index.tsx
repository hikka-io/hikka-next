import { CommentsContentType } from '@hikka/client';
import {
    contentCommentsOptions,
} from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { CommentList as Comments, prefetchContent } from '@/features/comments';

export const Route = createFileRoute(
    '/_pages/comments/$content_type/$slug/',
)({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { content_type, slug } = params;

        const content = await prefetchContent({
            content_type: content_type as CommentsContentType,
            slug,
            queryClient,
            hikkaClient,
        });

        if (!content) throw redirect({ to: '/' });

        await queryClient.prefetchInfiniteQuery(
            contentCommentsOptions(hikkaClient, {
                contentType: content_type as CommentsContentType,
                slug,
            }) as any,
        );

        return { content };
    },
    head: () => ({
        meta: [{ title: 'Коментарі / Hikka' }],
    }),
    component: CommentsPage,
});

function CommentsPage() {
    const { content_type, slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
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
