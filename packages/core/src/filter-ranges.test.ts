import { describe, expect, it } from 'vitest';

import { SCORE_RANGE, YEAR_RANGE, YEARS } from './filter-ranges';

describe('filter ranges', () => {
    it('spans release years from 1965 to the current year', () => {
        expect(YEARS).toEqual([1965, new Date().getFullYear()]);
    });

    it('spans scores from 1 to 10', () => {
        expect(SCORE_RANGE).toEqual([1, 10]);
    });

    it('keeps the year range ends', () => {
        expect(Object.values(YEAR_RANGE)).toEqual(['min', 'max']);
    });
});
