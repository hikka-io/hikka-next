import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    type CommentContentTypeEnum,
    ContentTypeEnum,
    serviceUserStatsOptions,
} from '@hikka/api';
import {
    type CommentOrder,
    commentsSearchSchema,
    contentPath,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
    getContentTitle,
} from '@hikka/core';

import { usePageHeader } from '@/features/app-shell';
import {
    CommentList,
    supportsReviews,
    UserCommentList,
    type Verdict,
} from '@/features/comments';
import {
    commentListOptions,
    loadCommentsContent,
    userCommentListOptions,
} from '@/features/comments/queries';
import {
    ContentSubpage,
    contentNavRoutes,
    hasContentNav,
    useContentTitle,
} from '@/features/content';
import { useChangeParam } from '@/features/filters';
import {
    type ContentInfoType,
    contentInfoOptions,
    isContentInfoType,
} from '@/utils/api/content-queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/comments/$content_type/$slug/')({
    validateSearch: zodValidator(commentsSearchSchema),
    beforeLoad: ({ params }) => {
        if (!isContentInfoType(params.content_type))
            throw redirect({ to: '/' });
    },
    loaderDeps: ({ search }) => search,
    loader: async ({ params, deps, context }) => {
        const { queryClient, apiClient } = context;
        const { content_type, slug } = params;
        const filters = {
            commentType: deps.comment_type,
            sort: deps.sort,
            order: deps.order,
        };

        const prefetchComments =
            content_type === ContentTypeEnum.USER
                ? Promise.all([
                      queryClient.prefetchInfiniteQuery(
                          userCommentListOptions(
                              slug,
                              {
                                  ...filters,
                                  firstLevelOnly: deps.first_level_only,
                              },
                              apiClient,
                          ),
                      ),
                      queryClient.prefetchQuery(
                          serviceUserStatsOptions({
                              path: { username: slug },
                              client: apiClient,
                          }),
                      ),
                  ])
                : queryClient.prefetchInfiniteQuery(
                      commentListOptions(
                          content_type as CommentContentTypeEnum,
                          slug,
                          { ...filters, verdict: deps.recommended },
                          apiClient,
                      ),
                  );

        const [content] = await Promise.all([
            loadCommentsContent(content_type as ContentInfoType, slug, context),
            prefetchComments,
        ]);

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
    const { comment_type, recommended, sort, order, first_level_only } =
        Route.useSearch();
    const { data: content } = useQuery(
        contentInfoOptions(content_type as ContentInfoType, slug),
    );
    const navigate = Route.useNavigate();
    const changeParam = useChangeParam();
    const contentTitle =
        useContentTitle(content_type as ContentTypeEnum, content) || undefined;
    const isUser = content_type === ContentTypeEnum.USER;
    const navRoutes = useMemo(
        () =>
            hasContentNav(content_type)
                ? contentNavRoutes(content_type, slug)
                : undefined,
        [content_type, slug],
    );

    usePageHeader({
        title: contentTitle,
        subtitle: 'Коментарі',
        parent: contentPath(content_type as ContentTypeEnum, slug),
        navRoutes,
        anchored: true,
    });

    const commentType = comment_type ?? 'all';

    // Both handlers write every affected key in one navigation — `useChangeParam`
    // writes a single key per async navigate, so two calls in a tick can drop one.
    const handleCommentTypeChange = (type: string) =>
        navigate({
            search: (prev) => ({
                ...prev,
                comment_type:
                    type === 'all' ? undefined : (type as 'comment' | 'review'),
                recommended: type === 'review' ? prev.recommended : undefined,
            }),
            replace: true,
            resetScroll: false,
        });

    // Picking a verdict implies the review tab; clearing one leaves the tab
    // alone, so clearing from "Усі" returns you there rather than to "Відгуки".
    const handleVerdictChange = (next: Verdict | null) =>
        navigate({
            search: (prev) => ({
                ...prev,
                ...(next && { comment_type: 'review' as const }),
                recommended: next ?? undefined,
            }),
            replace: true,
            resetScroll: false,
        });

    const sortProps = {
        sort: sort ?? DEFAULT_COMMENT_SORT,
        order: order ?? DEFAULT_COMMENT_ORDER,
        onSortChange: (value: string) =>
            changeParam('sort', value === DEFAULT_COMMENT_SORT ? '' : value),
        onOrderChange: (value: CommentOrder) =>
            changeParam('order', value === DEFAULT_COMMENT_ORDER ? '' : value),
    };

    return (
        <ContentSubpage
            slug={slug}
            contentType={
                content_type as
                    | CommentContentTypeEnum
                    | typeof ContentTypeEnum.USER
            }
            title={isUser ? 'Коментарі' : 'Обговорення'}
            count={
                content &&
                'comments_count' in content &&
                !supportsReviews(content_type)
                    ? content.comments_count
                    : undefined
            }
        >
            {isUser ? (
                <UserCommentList
                    username={slug}
                    commentType={commentType}
                    onCommentTypeChange={handleCommentTypeChange}
                    firstLevelOnly={first_level_only}
                    onFirstLevelOnlyChange={(value) =>
                        changeParam('first_level_only', value)
                    }
                    {...sortProps}
                />
            ) : (
                <CommentList
                    hideTitle
                    slug={slug}
                    content_type={content_type as CommentContentTypeEnum}
                    contentTitle={contentTitle}
                    commentType={commentType}
                    onCommentTypeChange={handleCommentTypeChange}
                    // Gated like the query body: a bare `?recommended` with
                    // no review tab must not render as an active filter.
                    verdict={
                        commentType === 'review' ? (recommended ?? null) : null
                    }
                    onVerdictChange={handleVerdictChange}
                    {...sortProps}
                />
            )}
        </ContentSubpage>
    );
}
