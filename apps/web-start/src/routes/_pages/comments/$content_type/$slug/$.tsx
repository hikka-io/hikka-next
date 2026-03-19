import { CommentsContentType } from '@hikka/client';
import {
    commentThreadOptions,
} from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { CommentList as Comments, prefetchContent } from '@/features/comments';

export const Route = createFileRoute(
    '/_pages/comments/$content_type/$slug/$',
)({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { content_type, slug, _splat: commentReference } = params;

        const content = await prefetchContent({
            content_type: content_type as CommentsContentType,
            slug,
            queryClient,
            hikkaClient,
        });

        if (!content) throw redirect({ to: '/' });

        if (commentReference) {
            await queryClient.prefetchQuery(
                commentThreadOptions(hikkaClient, {
                    commentReference,
                }),
            );
        }

        return { content, commentReference };
    },
    head: () => ({
        meta: [{ title: 'Коментарі / Hikka' }],
    }),
    component: CommentsThreadPage,
});

function CommentsThreadPage() {
    const { content_type, slug, _splat: commentReference } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    slug={slug}
                    content_type={content_type as CommentsContentType}
                />
                <Comments
                    comment_reference={commentReference}
                    slug={slug}
                    content_type={content_type as CommentsContentType}
                />
            </div>
        </div>
    );
}
