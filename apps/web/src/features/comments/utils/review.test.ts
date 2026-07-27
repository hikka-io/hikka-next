import { describe, expect, it } from 'vitest';

import {
    REVIEW_AUTO_THRESHOLD,
    canConvertReview,
    getPlainTextLength,
    getReviewTotal,
    getReviewVerdict,
    supportsReviews,
    toReviewArgs,
} from './review';

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

describe('canConvertReview', () => {
    const base = {
        isAuthor: true,
        hidden: false,
        text: 'Чудовий тайтл, рекомендую всім.',
        parent: null,
        contentType: 'anime',
    };

    it('is true for an author-owned visible root comment on anime/manga/novel', () => {
        expect(canConvertReview(base)).toBe(true);
        expect(canConvertReview({ ...base, contentType: 'manga' })).toBe(true);
        expect(canConvertReview({ ...base, contentType: 'novel' })).toBe(true);
    });

    it('is false when the user is not the author', () => {
        expect(canConvertReview({ ...base, isAuthor: false })).toBe(false);
    });

    it('is false for hidden (deleted) comments', () => {
        expect(canConvertReview({ ...base, hidden: true })).toBe(false);
    });

    it('is false when text is missing', () => {
        expect(canConvertReview({ ...base, text: null })).toBe(false);
        expect(canConvertReview({ ...base, text: '' })).toBe(false);
    });

    it('is false for replies (non-root comments)', () => {
        expect(canConvertReview({ ...base, parent: 'some-parent-ref' })).toBe(
            false,
        );
    });

    it('is false for content types without reviews', () => {
        expect(canConvertReview({ ...base, contentType: 'article' })).toBe(
            false,
        );
        expect(canConvertReview({ ...base, contentType: 'collection' })).toBe(
            false,
        );
    });
});

describe('getPlainTextLength', () => {
    it('returns 0 for an empty document', () => {
        expect(getPlainTextLength([])).toBe(0);
        expect(
            getPlainTextLength([{ type: 'p', children: [{ text: '' }] }]),
        ).toBe(0);
    });

    it('sums text across paragraphs', () => {
        expect(
            getPlainTextLength([
                { type: 'p', children: [{ text: 'hello' }] },
                { type: 'p', children: [{ text: 'world!' }] },
            ]),
        ).toBe(11);
    });

    it('counts marked text nodes and nested elements', () => {
        expect(
            getPlainTextLength([
                {
                    type: 'p',
                    children: [
                        { text: 'plain ' },
                        { text: 'bold', bold: true },
                    ],
                },
                {
                    type: 'blockquote',
                    children: [{ type: 'p', children: [{ text: 'nested' }] }],
                },
            ]),
        ).toBe(16);
    });

    it('counts whitespace characters', () => {
        expect(
            getPlainTextLength([{ type: 'p', children: [{ text: '   ' }] }]),
        ).toBe(3);
    });
});

describe('REVIEW_AUTO_THRESHOLD', () => {
    it('is 500', () => {
        expect(REVIEW_AUTO_THRESHOLD).toBe(500);
    });
});

describe('getReviewTotal', () => {
    it('is 0 for undefined stats', () => {
        expect(getReviewTotal(undefined)).toBe(0);
    });

    it('coalesces missing fields to 0', () => {
        expect(getReviewTotal({ yes: 3 })).toBe(3);
    });

    it('sums all three verdicts', () => {
        expect(getReviewTotal({ yes: 8, maybe: 3, no: 1 })).toBe(12);
    });
});

describe('getReviewVerdict', () => {
    it('is null for undefined stats', () => {
        expect(getReviewVerdict(undefined)).toBeNull();
    });

    it('is null when there are no reviews', () => {
        expect(getReviewVerdict({ yes: 0, maybe: 0, no: 0 })).toBeNull();
    });

    it('reads as recommended when all reviews are positive', () => {
        expect(getReviewVerdict({ yes: 5, maybe: 0, no: 0 })).toBe(
            'Здебільшого радять',
        );
    });

    it('reads as recommended exactly at the majority threshold', () => {
        expect(getReviewVerdict({ yes: 6, maybe: 2, no: 2 })).toBe(
            'Здебільшого радять',
        );
    });

    // The reference design labels this exact distribution "Здебільшого радять".
    it('reads as recommended for the reference 8/3/1 split', () => {
        expect(getReviewVerdict({ yes: 8, maybe: 3, no: 1 })).toBe(
            'Здебільшого радять',
        );
    });

    it('reads as not recommended when all reviews are negative', () => {
        expect(getReviewVerdict({ yes: 0, maybe: 0, no: 5 })).toBe(
            'Здебільшого не радять',
        );
    });

    it('reads as not recommended exactly at the majority threshold', () => {
        expect(getReviewVerdict({ yes: 2, maybe: 2, no: 6 })).toBe(
            'Здебільшого не радять',
        );
    });

    it('reads as mixed impressions when maybe is the strict maximum', () => {
        expect(getReviewVerdict({ yes: 2, maybe: 5, no: 3 })).toBe(
            'Неоднозначні враження',
        );
    });

    it('reads as divided on an even three-way split', () => {
        expect(getReviewVerdict({ yes: 1, maybe: 1, no: 1 })).toBe(
            'Думки розділились',
        );
    });

    it('reads as divided just below the positive threshold', () => {
        expect(getReviewVerdict({ yes: 59, maybe: 0, no: 41 })).toBe(
            'Думки розділились',
        );
    });

    it('reads as divided when no side reaches a majority', () => {
        expect(getReviewVerdict({ yes: 5, maybe: 1, no: 4 })).toBe(
            'Думки розділились',
        );
    });
});
