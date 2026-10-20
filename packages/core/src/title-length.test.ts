import { describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import { isValidTitleLength } from './title-length';

const BOUNDS = { min: 3, max: 10 };

describe('isValidTitleLength', () => {
    it.each([
        ['the minimum length', 'abc'],
        ['the maximum length', 'a'.repeat(10)],
        ['padding around the minimum', '  abc  '],
        ['a regular title', 'Стаття'],
    ])('accepts %s', (_, title) => {
        expect(isValidTitleLength(title, BOUNDS)).toBe(true);
    });

    it.each([
        ['no title', undefined],
        ['a null title', null],
        ['an empty title', ''],
        ['a title below the minimum', 'ab'],
        ['a short title padded with spaces', '  ab  '],
        ['a blank title', ' '.repeat(5)],
        ['a title over the maximum', 'a'.repeat(11)],
        ['padding that pushes a title over the maximum', ` ${'a'.repeat(10)}`],
    ])('rejects %s', (_, title) => {
        expect(isValidTitleLength(title, BOUNDS)).toBe(false);
    });

    it.each([
        ['article', API_LIMITS.articleTitle],
        ['collection', API_LIMITS.collectionTitle],
    ])('takes the %s bounds as they are', (_, bounds) => {
        expect(isValidTitleLength('a'.repeat(bounds.min), bounds)).toBe(true);
        expect(isValidTitleLength('a'.repeat(bounds.max), bounds)).toBe(true);
        expect(isValidTitleLength('a'.repeat(bounds.min - 1), bounds)).toBe(
            false,
        );
        expect(isValidTitleLength('a'.repeat(bounds.max + 1), bounds)).toBe(
            false,
        );
    });
});
