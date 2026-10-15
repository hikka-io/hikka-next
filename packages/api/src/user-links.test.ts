import { describe, expect, it } from 'vitest';

import type { UserLinkResponse } from './gen';
import { isWebUrl, parseUserLinks } from './user-links';

describe('isWebUrl', () => {
    it.each([
        ['https://hikka.io', true],
        ['http://hikka.io', true],
        ['javascript:alert(1)', false],
        ['hikka.io', false],
    ])('%s is %s', (value, expected) => {
        expect(isWebUrl(value)).toBe(expected);
    });
});

describe('parseUserLinks', () => {
    it('keeps valid links in order', () => {
        const links: UserLinkResponse[] = [
            { icon: 'github', url: 'https://github.com/hikka', text: null },
            { icon: 'custom', url: 'https://hikka.io', text: 'Hikka' },
        ];

        expect(parseUserLinks(links)).toEqual(links);
    });

    it('drops links that are not http(s)', () => {
        expect(
            parseUserLinks([
                { icon: 'custom', url: 'javascript:alert(1)', text: null },
                { icon: 'custom', url: 'not a url', text: null },
                { icon: 'telegram', url: 'https://t.me/hikka', text: null },
            ]),
        ).toEqual([
            { icon: 'telegram', url: 'https://t.me/hikka', text: null },
        ]);
    });

    it('treats missing links as empty', () => {
        expect(parseUserLinks(undefined)).toEqual([]);
    });
});
