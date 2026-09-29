import type { Client, CommentsFilterArgs } from '@hikka/api';
import { API_LIMITS, threadInfiniteOptions } from '@hikka/api';

import { getCommentSort } from '@/utils/sort';

export const THREAD_PAGE_SIZE = API_LIMITS.pageSize.max;

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

// Must hash equal to comment-list's unfiltered body: add no `recommended`, not even null.
export function commentListPrefetchBody(): CommentsFilterArgs {
    return { comment_type: 'all', sort: getCommentSort() };
}
