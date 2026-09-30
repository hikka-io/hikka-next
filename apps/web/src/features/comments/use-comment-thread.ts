import { skipToken } from '@tanstack/react-query';

import type { CommentListResponse } from '@hikka/api';

import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { commentThreadOptions } from './queries';

/**
 * Full subtree of a comment, led by the comment itself. List responses cap a
 * comment at ~10 replies; the rest comes from here.
 */
export function useCommentThread(
    reference: string | undefined,
    enabled = true,
) {
    return useInfiniteList<CommentListResponse>(
        {
            // `ThreadResponse` is a union; `flat=true` yields the list side.
            ...commentThreadOptions(String(reference)),
            // `skipToken` holds through `refetch()`, which ignores `enabled`.
            ...(reference ? undefined : { queryFn: skipToken }),
        } as unknown as Parameters<
            typeof useInfiniteList<CommentListResponse>
        >[0],
        { enabled: enabled && !!reference },
    );
}
