import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import type { CommentContentTypeEnum, ContentTypeEnum } from '@hikka/api';
import {
    commentExcerpt,
    commentThreadTitle,
    getContentTitle,
} from '@hikka/core';

import { usePageHeader } from '@/features/app-shell';
import { CommentList, useCommentThread } from '@/features/comments';
import {
    loadCommentsContent,
    loadCommentThread,
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
        const { content_type, slug, _splat: commentReference } = params;

        const [content, comment] = await Promise.all([
            loadCommentsContent(content_type as ContentInfoType, slug, context),
            commentReference
                ? loadCommentThread(commentReference, context)
                : undefined,
        ]);

        return { content, comment };
    },
    head: ({ loaderData, params }) => {
        const comment = loaderData?.comment;
        const contentTitle = getContentTitle(
            params.content_type as ContentTypeEnum,
            loaderData?.content,
        );
        const title = comment ? commentThreadTitle(comment) : 'Коментарі';

        return generateHeadMeta({
            title: contentTitle ? `${title} / ${contentTitle}` : title,
            description:
                comment && !comment.hidden
                    ? commentExcerpt(comment.text, 150)
                    : 'Гілка коментарів спільноти на Hikka',
        });
    },
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
    const { list, pagination } = useCommentThread(commentReference);
    const comment = list?.find((item) => item.reference === commentReference);
    const title = comment ? commentThreadTitle(comment) : 'Коментар';
    const replies = pagination ? pagination.total - 1 : 0;

    usePageHeader({
        title: contentTitle,
        subtitle: title,
        parent: `/comments/${content_type}/${slug}`,
        anchored: true,
    });

    return (
        <ContentSubpage
            slug={slug}
            contentType={content_type as CommentContentTypeEnum}
            title={title}
            count={replies > 0 ? replies : undefined}
        >
            <CommentList
                hideTitle
                comment_reference={commentReference}
                slug={slug}
                content_type={content_type as CommentContentTypeEnum}
            />
        </ContentSubpage>
    );
}
