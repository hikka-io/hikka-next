import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
    isCommentSort,
} from '@/utils/constants/comment-sort';
import { formatSort } from '@/utils/sort-format';

/**
 * Builds the `sort` body field for the comment list endpoints. Loaders and
 * component-body queries must pass the same arguments — the body is part of
 * the query key, so a mismatch refetches instead of hydrating.
 */
export function getCommentSort(sort?: string, order?: CommentOrder): string[] {
    let field = DEFAULT_COMMENT_SORT;

    if (isCommentSort(sort)) {
        field = sort;
    } else if (sort && import.meta.env.DEV) {
        // Stale URLs should degrade quietly; bad call sites should not.
        console.warn(`[comment-sort] unknown sort "${sort}", using "${field}"`);
    }

    return formatSort([field], order ?? DEFAULT_COMMENT_ORDER);
}
