import {
    API_LIMITS,
    type Client,
    type CommentContentTypeEnum,
    type CommentsFilterArgs,
    type CommentTypeEnum,
    getCommentsListInfiniteOptions,
    getCommentsUserInfiniteOptions,
    paginationPageParam,
    threadInfiniteOptions,
} from '@hikka/api';

import { type CommentOrder, getCommentSort } from '@/utils/sort';

export const THREAD_PAGE_SIZE = API_LIMITS.pageSize.max;
const COMMENT_PREVIEW_SIZE = 3;

type CommentListFilters = {
    commentType?: CommentTypeEnum;
    sort?: string;
    order?: CommentOrder;
};

export function commentThreadOptions(reference: string, client?: Client) {
    return {
        ...threadInfiniteOptions({
            path: { comment_reference: reference },
            query: { flat: true, size: THREAD_PAGE_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function commentListOptions(
    content_type: CommentContentTypeEnum,
    slug: string,
    {
        commentType = 'all',
        sort,
        order,
        verdict,
        preview = false,
    }: CommentListFilters & {
        verdict?: CommentsFilterArgs['recommended'];
        preview?: boolean;
    } = {},
    client?: Client,
) {
    return {
        ...getCommentsListInfiniteOptions({
            path: { content_type, slug },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                // `undefined`, never `null`: null keys apart from the unfiltered list.
                recommended:
                    commentType === 'review'
                        ? (verdict ?? undefined)
                        : undefined,
            },
            query: preview ? { size: COMMENT_PREVIEW_SIZE } : undefined,
            client,
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
    client?: Client,
) {
    return {
        ...getCommentsUserInfiniteOptions({
            path: { username },
            body: {
                comment_type: commentType,
                sort: getCommentSort(sort, order),
                first_level_only: firstLevelOnly || undefined,
            },
            client,
        }),
        ...paginationPageParam(),
    };
}
