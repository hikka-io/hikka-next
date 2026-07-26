import type { SortOrder } from '@/utils/sort-format';

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

export function isCommentSort(value: unknown): value is CommentSort {
    return COMMENT_SORT_VALUES.includes(value as CommentSort);
}
