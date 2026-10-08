import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import type { CommentContentTypeEnum, ContentTypeEnum } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { CommentList } from '@/features/comments';
import {
    commentThreadOptions,
    loadCommentsContent,
} from '@/features/comments/queries';
import { ContentSubpage, useContentTitle } from '@/features/content';
import {
    type ContentInfoType,
    contentInfoOptions,
    isContentInfoType,
} from '@/utils/api/content-queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/$')({
    beforeLoad: ({ params }) => {
        if (!isContentInfoType(params.content_type))
            throw redirect({ to: '/' });
    },
    loader: async ({ params, context }) => {
        const { queryClient, apiClient } = context;
        const { content_type, slug, _splat: commentReference } = params;

        await Promise.all([
            loadCommentsContent(content_type as ContentInfoType, slug, context),
            commentReference
                ? queryClient.prefetchInfiniteQuery(
                      commentThreadOptions(commentReference, apiClient),
                  )
                : undefined,
        ]);
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
    const { data: content } = useQuery(
        contentInfoOptions(content_type as ContentInfoType, slug),
    );
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
