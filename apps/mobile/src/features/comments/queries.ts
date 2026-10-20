import type { UseQueryOptions } from '@tanstack/react-query';

import {
    API_LIMITS,
    animeSlugOptions,
    type CommentContentTypeEnum,
    type CommentTypeEnum,
    commentsListInfiniteOptions,
    getCommentsListInfiniteOptions,
    getCommentsUserInfiniteOptions,
    MainContentTypeEnum,
    mangaInfoOptions,
    novelInfoOptions,
    paginationPageParam,
    type ReviewStatsResponse,
    threadInfiniteOptions,
} from '@hikka/api';
import { type CommentOrder, getCommentSort, type Verdict } from '@hikka/core';

export const THREAD_PAGE_SIZE = API_LIMITS.pageSize.max;
export const COMMENT_PREVIEW_SIZE = 3;

export type CommentListFilters = {
    commentType?: CommentTypeEnum;
    sort?: string;
    order?: CommentOrder;
    verdict?: Verdict | null;
};

/** The web's `commentListOptions`: the body must match it, so the preview and the page share one key shape. */
export function commentListOptions(
    content_type: CommentContentTypeEnum,
    slug: string,
    { commentType = 'all', sort, order, verdict }: CommentListFilters = {},
    preview = false,
) {
    return {
        ...getCommentsListInfiniteOptions({
            path: { content_type, slug },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                recommended:
                    commentType === 'review'
                        ? (verdict ?? undefined)
                        : undefined,
            },
            query: preview ? { size: COMMENT_PREVIEW_SIZE } : undefined,
        }),
        ...paginationPageParam(),
    };
}

export function commentThreadOptions(reference: string) {
    return {
        ...threadInfiniteOptions({
            path: { comment_reference: reference },
            query: { flat: true, size: THREAD_PAGE_SIZE },
        }),
        ...paginationPageParam(),
    };
}

export function userCommentListOptions(
    username: string,
    {
        commentType = 'all',
        sort,
        order,
        firstLevelOnly,
    }: CommentListFilters & { firstLevelOnly?: boolean } = {},
) {
    return {
        ...getCommentsUserInfiniteOptions({
            path: { username },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                first_level_only: firstLevelOnly || undefined,
            },
        }),
        ...paginationPageParam(),
    };
}

export function latestCommentsOptions() {
    return { ...commentsListInfiniteOptions(), ...paginationPageParam() };
}

export type CommentStats = {
    commentsCount: number;
    reviewStats: ReviewStatsResponse | undefined;
    nsfw: boolean;
};

type StatsSource = {
    comments_count: number;
    review_stats?: ReviewStatsResponse;
    nsfw: boolean;
};

type StatsOptions = UseQueryOptions<
    StatsSource,
    Error,
    CommentStats,
    readonly unknown[]
>;

const CONTENT_INFO = {
    [MainContentTypeEnum.ANIME]: (slug: string) =>
        animeSlugOptions({ path: { slug } }),
    [MainContentTypeEnum.MANGA]: (slug: string) =>
        mangaInfoOptions({ path: { slug } }),
    [MainContentTypeEnum.NOVEL]: (slug: string) =>
        novelInfoOptions({ path: { slug } }),
} satisfies Record<MainContentTypeEnum, unknown>;

/** The comment and review counts and the 18+ flag from the content info: the detail page's own query (same key). */
export function commentStatsOptions(
    content_type: MainContentTypeEnum,
    slug: string,
): StatsOptions {
    return {
        ...(CONTENT_INFO[content_type](slug) as unknown as StatsOptions),
        select: (data) => ({
            commentsCount: data.comments_count,
            reviewStats: data.review_stats,
            nsfw: data.nsfw,
        }),
    };
}
