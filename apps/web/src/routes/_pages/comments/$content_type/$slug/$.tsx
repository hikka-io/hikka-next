import { createFileRoute, redirect } from '@tanstack/react-router';

import {
    type CommentContentTypeEnum,
    type ContentTypeEnum,
    paginationPageParam,
} from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { CommentList } from '@/features/comments';
import { commentThreadInfiniteOptions } from '@/features/comments/queries';
import { ContentSubpage, useContentTitle } from '@/features/content';
import { fetchContentForLoader } from '@/utils/api/content-queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/$')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { content_type, slug, _splat: commentReference } = params;

        const content = await fetchContentForLoader(
            content_type as CommentContentTypeEnum,
            slug,
            { queryClient, apiClient },
        );

        if (!content) throw redirect({ to: '/' });

        if (commentReference) {
            await queryClient.prefetchInfiniteQuery({
                ...commentThreadInfiniteOptions(commentReference, apiClient),
                ...paginationPageParam(),
            });
        }

        return { content, commentReference };
    },
    head: () =>
        generateHeadMeta({
            title: 'Коментарі',
            description: 'Гілка коментарів спільноти на Hikka',
        }),
    component: CommentsThreadPage,
});

function CommentsThreadPage() {
    const { content_type, slug, _splat: commentReference } = Route.useParams();
    const { content } = Route.useLoaderData();
    const contentTitle = useContentTitle(
        content_type as ContentTypeEnum,
        content,
    );

    usePageHeader({
        title: contentTitle,
        subtitle: 'Гілка',
        parent: `/comments/${content_type}/${slug}`,
    });

    return (
        <ContentSubpage
            slug={slug}
            contentType={content_type as CommentContentTypeEnum}
        >
            <CommentList
                comment_reference={commentReference}
                slug={slug}
                content_type={content_type as CommentContentTypeEnum}
            />
        </ContentSubpage>
    );
}
