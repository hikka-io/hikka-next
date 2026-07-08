import { describe, expect, it } from 'vitest';

import {
    REVIEW_AUTO_THRESHOLD,
    canConvertReview,
    getPlainTextLength,
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
