import { describe, expect, it } from 'vitest';

import { resolveCommentSort } from './use-comment-sort';

describe('resolveCommentSort', () => {
    const local = {
        sort: 'created',
        order: 'desc' as const,
        setSort: () => {},
        setOrder: () => {},
    };

    it('uses local state when uncontrolled', () => {
        const state = resolveCommentSort({}, local);

        expect(state.sort).toBe('created');
        expect(state.order).toBe('desc');
        expect(state.setSort).toBe(local.setSort);
        expect(state.setOrder).toBe(local.setOrder);
    });

    it('uses the caller when controlled', () => {
        const onSortChange = () => {};
        const onOrderChange = () => {};
        const state = resolveCommentSort(
            { sort: 'vote_score', order: 'asc', onSortChange, onOrderChange },
            local,
        );

        expect(state.sort).toBe('vote_score');
        expect(state.order).toBe('asc');
        expect(state.setSort).toBe(onSortChange);
        expect(state.setOrder).toBe(onOrderChange);
    });
});
