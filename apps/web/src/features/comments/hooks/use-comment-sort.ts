import { useState } from 'react';

import {
    type CommentOrder,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from '@/utils/constants/comment-sort';

/**
 * All four go together: a half set resolves the value from local state that the
 * setter never writes, freezing the control.
 */
type ControlledCommentSort = {
    sort: string;
    order: CommentOrder;
    onSortChange: (sort: string) => void;
    onOrderChange: (order: CommentOrder) => void;
};

export type CommentSortProps =
    | ControlledCommentSort
    | { [K in keyof ControlledCommentSort]?: never };

type CommentSortState = {
    sort: string;
    order: CommentOrder;
    setSort: (sort: string) => void;
    setOrder: (order: CommentOrder) => void;
};

/** Pure half of {@link useCommentSort}, split out so the branches are testable. */
export function resolveCommentSort(
    props: CommentSortProps,
    local: CommentSortState,
): CommentSortState {
    return {
        sort: props.sort ?? local.sort,
        order: props.order ?? local.order,
        setSort: props.onSortChange ?? local.setSort,
        setOrder: props.onOrderChange ?? local.setOrder,
    };
}

export function useCommentSort(props: CommentSortProps): CommentSortState {
    const [localSort, setLocalSort] = useState<string>(DEFAULT_COMMENT_SORT);
    const [localOrder, setLocalOrder] = useState<CommentOrder>(
        DEFAULT_COMMENT_ORDER,
    );

    return resolveCommentSort(props, {
        sort: localSort,
        order: localOrder,
        setSort: setLocalSort,
        setOrder: setLocalOrder,
    });
}
