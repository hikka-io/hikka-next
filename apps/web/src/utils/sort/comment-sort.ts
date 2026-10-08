import { formatSort, type SortOrder } from './format';

export type CommentOrder = SortOrder;

/** Sort fields accepted by the comment list endpoints. */
export const COMMENT_SORT_VALUES = [
    'created',
    'updated',
    'vote_score',
    'total_replies',
] as const;

export type CommentSort = (typeof COMMENT_SORT_VALUES)[number];

const COMMENT_SORT_LABELS: Record<CommentSort, string> = {
    created: 'Дата створення',
    updated: 'Дата оновлення',
    vote_score: 'Оцінка',
    total_replies: 'К-сть відповідей',
};

// Frozen deep — `SORT_CONFIGS.comment` aliases this array, so a mutation here
// rewrites the options the search schema validates against.
export const COMMENT_SORT_OPTIONS: readonly Readonly<{
    label: string;
    value: CommentSort;
}>[] = Object.freeze(
    COMMENT_SORT_VALUES.map((value) =>
        Object.freeze({
            label: COMMENT_SORT_LABELS[value],
            value,
        }),
    ),
);

export const DEFAULT_COMMENT_SORT: CommentSort = 'created';
export const DEFAULT_COMMENT_ORDER: CommentOrder = 'desc';

function isCommentSort(value: unknown): value is CommentSort {
    return COMMENT_SORT_VALUES.includes(value as CommentSort);
}

/**
 * Builds the `sort` body field for the comment list endpoints. Loaders and
 * component-body queries must pass the same arguments — the body is part of the
 * query key, so a mismatch refetches instead of hydrating.
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
