import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    type CommentContentTypeEnum as CommentsContentType,
    ContentTypeEnum,
    getCommentsListInfiniteOptions,
    getCommentsUserInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import {
    CommentList as Comments,
    getContentTitle,
    prefetchContent,
    UserCommentList,
    useContentTitle,
} from '@/features/comments';
import ContentHeader from '@/features/comments/content-header';
import { getCommentSort } from '@/features/comments/utils/comment-sort';
import { useChangeParam } from '@/features/filters';
import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from '@/utils/constants/comment-sort';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';
import { commentsSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/')({
    validateSearch: zodValidator(commentsSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ params, deps, context: { queryClient, apiClient } }) => {
        const { content_type, slug } = params;
        const commentType = deps.comment_type ?? 'all';
        const sort = getCommentSort(deps.sort, deps.order);

        const content = await prefetchContent({
            content_type: content_type as ContentTypeEnum,
            slug,
            queryClient,
            apiClient,
        });

        if (!content) throw redirect({ to: '/' });

        if (content_type === ContentTypeEnum.USER) {
            await queryClient.prefetchInfiniteQuery({
                ...getCommentsUserInfiniteOptions({
                    path: { username: slug },
                    body: { comment_type: commentType, sort },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            });
        } else {
            await queryClient.prefetchInfiniteQuery({
                ...getCommentsListInfiniteOptions({
                    path: {
                        content_type: content_type as CommentsContentType,
                        slug,
                    },
                    body: { comment_type: commentType, sort },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            });
        }

        return { content };
    },
    head: ({ loaderData, params }) => {
        const { content_type } = params;
        const content = loaderData?.content as Record<string, any> | undefined;
        const title = getContentTitle(content_type as ContentTypeEnum, content);

        return generateHeadMeta({
            title: title ? `Коментарі / ${title}` : 'Коментарі',
        });
    },
    component: CommentsPage,
});

function CommentsPage() {
    const { content_type, slug } = Route.useParams();
    const { comment_type, sort, order } = Route.useSearch();
    const { content } = Route.useLoaderData();
    const changeParam = useChangeParam();
    const contentTitle =
        useContentTitle(content_type as ContentTypeEnum, content) || undefined;
    const isUser = content_type === ContentTypeEnum.USER;

    usePageHeader({
        title: contentTitle,
        subtitle: 'Коментарі',
        parent: `${CONTENT_TYPE_LINKS[content_type as ContentTypeEnum]}/${slug}`,
    });

    const commentType = comment_type ?? 'all';
    const handleCommentTypeChange = (type: string) =>
        changeParam('comment_type', type === 'all' ? '' : type);

    const sortProps = {
        sort: sort ?? DEFAULT_COMMENT_SORT,
        order: order ?? DEFAULT_COMMENT_ORDER,
        onSortChange: (value: string) =>
            changeParam('sort', value === DEFAULT_COMMENT_SORT ? '' : value),
        onOrderChange: (value: CommentOrder) =>
            changeParam('order', value === DEFAULT_COMMENT_ORDER ? '' : value),
    };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    slug={slug}
                    content_type={
                        content_type as
                            | CommentsContentType
                            | typeof ContentTypeEnum.USER
                    }
                />
                {isUser ? (
                    <UserCommentList
                        username={slug}
                        commentType={commentType}
                        onCommentTypeChange={handleCommentTypeChange}
                        {...sortProps}
                    />
                ) : (
                    <Comments
                        slug={slug}
                        content_type={content_type as CommentsContentType}
                        contentTitle={contentTitle}
                        commentType={commentType}
                        onCommentTypeChange={handleCommentTypeChange}
                        {...sortProps}
                    />
                )}
            </div>
        </div>
    );
}
