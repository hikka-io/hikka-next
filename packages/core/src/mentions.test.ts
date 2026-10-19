import { describe, expect, it } from 'vitest';

import { isMentionLabel, isUserReference, isUserUrl } from './mentions';

describe('mention helpers', () => {
    it('accepts the urls the picker writes', () => {
        expect(isUserUrl('/u/olexh')).toBe(true);
        expect(isUserUrl('https://hikka.io/u/olexh')).toBe(true);
        expect(
            isUserUrl(
                'https://hikka.io/u/58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23',
            ),
        ).toBe(true);
    });

    it('rejects urls that raw serialization would mangle', () => {
        expect(isUserUrl('https://hikka.io/u/name)and(more')).toBe(false);
        expect(isUserUrl('https://hikka.io/u/name with space')).toBe(false);
        expect(isUserUrl('https://hikka.io/u/olexh/list')).toBe(false);
        expect(isUserUrl('https://hikka.io/anime/naruto')).toBe(false);
    });

    it('only treats a bare @name as a mention label', () => {
        expect(isMentionLabel('@second_user')).toBe(true);
        expect(isMentionLabel('olexh')).toBe(false);
        expect(isMentionLabel('@olexh написав')).toBe(false);
    });

    it('tells a reference from a username', () => {
        expect(isUserReference('58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23')).toBe(
            true,
        );
        expect(isUserReference('olexh')).toBe(false);
    });
});
