import { HikkaClient } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseCommentListParams,
    UseCommentThreadParams,
    UseContentCommentsParams,
} from '@/types/comments';

export function commentListOptions(
    client: HikkaClient,
    { paginationArgs }: UseCommentListParams = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.comments.list(paginationArgs),
        queryFn: ({ pageParam }) =>
            client.comments.getCommentList({
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

export function contentCommentsOptions(
    client: HikkaClient,
    {
        contentType,
        slug,
        paginationArgs,
    }: UseContentCommentsParams,
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.comments.content(contentType, slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.comments.getContentComments(contentType, slug, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

export function latestCommentsOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.comments.latest(),
        queryFn: () => client.comments.getLatestComments(),
    });
}

export function commentThreadOptions(
    client: HikkaClient,
    { commentReference }: UseCommentThreadParams,
) {
    return queryOptions({
        queryKey: queryKeys.comments.thread(commentReference),
        queryFn: () => client.comments.getCommentThread(commentReference),
    });
}
