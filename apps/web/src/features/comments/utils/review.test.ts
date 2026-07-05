import { describe, expect, it } from 'vitest';

import { supportsReviews, toReviewArgs } from './review';

describe('supportsReviews', () => {
    it('is true for anime, manga, novel', () => {
        expect(supportsReviews('anime')).toBe(true);
        expect(supportsReviews('manga')).toBe(true);
        expect(supportsReviews('novel')).toBe(true);
    });

    it('is false for other content types', () => {
        expect(supportsReviews('collection')).toBe(false);
        expect(supportsReviews('character')).toBe(false);
        expect(supportsReviews('article')).toBe(false);
    });
});

describe('toReviewArgs', () => {
    it('returns undefined when not in review mode', () => {
        expect(toReviewArgs(false, 'yes')).toBeUndefined();
    });

    it('returns undefined when review mode but no verdict', () => {
        expect(toReviewArgs(true, null)).toBeUndefined();
    });

    it('returns the review payload when review mode and verdict set', () => {
        expect(toReviewArgs(true, 'maybe')).toEqual({ recommended: 'maybe' });
    });
});
