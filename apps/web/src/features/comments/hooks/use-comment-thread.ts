import { skipToken } from '@tanstack/react-query';

import type { Client, CommentListResponse } from '@hikka/api';
import { threadInfiniteOptions } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

export const THREAD_PAGE_SIZE = 100;

export function commentThreadInfiniteOptions(
    reference: string,
    client?: Client,
) {
    return threadInfiniteOptions({
        path: { comment_reference: reference },
        query: { flat: true, size: THREAD_PAGE_SIZE },
        client,
    });
}

/**
 * Full subtree of a comment, led by the comment itself. List responses cap a
 * comment at ~10 replies, so the rest of a thread comes from here.
 */
export function useCommentThread(
    reference: string | undefined,
    enabled = true,
) {
    return useInfiniteList<CommentListResponse>(
        {
            // `ThreadResponse` is a union; `flat=true` yields the list side.
            ...commentThreadInfiniteOptions(reference ?? 'disabled'),
            // `skipToken` holds through `refetch()`, which ignores `enabled`.
            ...(reference ? undefined : { queryFn: skipToken }),
        } as unknown as Parameters<
            typeof useInfiniteList<CommentListResponse>
        >[0],
        { enabled: enabled && !!reference },
    );
}
