import { describe, expect, it } from 'vitest';

import { isValidTag, normalizeTag } from './tags';

describe('tags', () => {
    it('normalizes case and surrounding spaces', () => {
        expect(normalizeTag('  Огляд ')).toBe('огляд');
    });

    it.each(['огляд', 'anime', 'їжак', 'ґанок', 'a'.repeat(16)])(
        'accepts %s',
        (tag) => {
            expect(isValidTag(tag)).toBe(true);
        },
    );

    it.each([
        ['too short', 'ab'],
        ['too long', 'a'.repeat(17)],
        ['digits', 'топ10'],
        ['spaces', 'два слова'],
        ['letters the backend bans', 'объём'],
    ])('rejects %s', (_, tag) => {
        expect(isValidTag(tag)).toBe(false);
    });
});
