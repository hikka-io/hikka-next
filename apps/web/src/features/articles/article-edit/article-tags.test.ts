import { describe, expect, it } from 'vitest';

import { isValidArticleTag, normalizeArticleTag } from './article-tags';

describe('article tags', () => {
    it('normalizes case and surrounding spaces', () => {
        expect(normalizeArticleTag('  Огляд ')).toBe('огляд');
    });

    it.each(['огляд', 'anime', 'їжак', 'ґанок', 'a'.repeat(16)])(
        'accepts %s',
        (tag) => {
            expect(isValidArticleTag(tag)).toBe(true);
        },
    );

    it.each([
        ['too short', 'ab'],
        ['too long', 'a'.repeat(17)],
        ['digits', 'топ10'],
        ['spaces', 'два слова'],
        ['letters the backend bans', 'объём'],
    ])('rejects %s', (_, tag) => {
        expect(isValidArticleTag(tag)).toBe(false);
    });
});
