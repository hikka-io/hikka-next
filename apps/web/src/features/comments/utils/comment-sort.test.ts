import { describe, expect, it } from 'vitest';

import { getSort } from '@/features/filters/sort';
import {
    COMMENT_SORT_OPTIONS,
    COMMENT_SORT_VALUES,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from '@/utils/constants/comment-sort';
import { commentsSearchSchema } from '@/utils/search-schemas';

import { getCommentSort } from './comment-sort';

describe('getCommentSort', () => {
    // Loaders pass nothing, components pass resolved state — same query key.
    it('falls back to the defaults', () => {
        const explicit = getCommentSort(
            DEFAULT_COMMENT_SORT,
            DEFAULT_COMMENT_ORDER,
        );

        expect(getCommentSort()).toEqual(['created:desc']);
        expect(explicit).toEqual(getCommentSort());
    });

    it('builds field:direction pairs', () => {
        expect(getCommentSort('vote_score', 'desc')).toEqual([
            'vote_score:desc',
        ]);
        expect(getCommentSort('total_replies', 'asc')).toEqual([
            'total_replies:asc',
        ]);
    });

    it('treats an empty field as unset', () => {
        expect(getCommentSort('', 'asc')).toEqual(['created:asc']);
    });

    // An unrecognised field is a backend `system:validation_error`.
    it('falls back instead of forwarding an unknown field', () => {
        expect(getCommentSort('crated', 'desc')).toEqual(['created:desc']);
    });
});

describe('comment sort options', () => {
    it('stays in sync with the filters sort config', () => {
        expect(getSort('comment').map((option) => option.value)).toEqual([
            ...COMMENT_SORT_VALUES,
        ]);
    });

    it('labels every value', () => {
        expect(COMMENT_SORT_OPTIONS).toHaveLength(COMMENT_SORT_VALUES.length);
        for (const option of COMMENT_SORT_OPTIONS) {
            expect(option.label).toBeTruthy();
        }
    });

    it('accepts every option as a URL search param', () => {
        for (const value of COMMENT_SORT_VALUES) {
            expect(commentsSearchSchema.parse({ sort: value }).sort).toBe(
                value,
            );
        }
    });

    it('includes the default', () => {
        expect(COMMENT_SORT_VALUES).toContain(DEFAULT_COMMENT_SORT);
    });

    it('is frozen all the way down', () => {
        expect(Object.isFrozen(COMMENT_SORT_OPTIONS)).toBe(true);
        for (const option of COMMENT_SORT_OPTIONS) {
            expect(Object.isFrozen(option)).toBe(true);
        }
    });
});
