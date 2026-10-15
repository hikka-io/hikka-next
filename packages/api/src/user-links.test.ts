import { describe, expect, it } from 'vitest';

import { parseUserLinks } from './user-links';

describe('parseUserLinks', () => {
    it('keeps valid links in order', () => {
        const links = [
            { icon: 'github', url: 'https://github.com/hikka', text: null },
            { icon: 'custom', url: 'https://hikka.io', text: 'Hikka' },
        ];

        expect(parseUserLinks(links)).toEqual(links);
    });

    it('drops entries that do not match the link schema', () => {
        expect(
            parseUserLinks([
                { icon: 'myspace', url: 'https://myspace.com/hikka' },
                { icon: 'github', url: 'not a url' },
                { icon: 'custom', url: 'javascript:alert(1)' },
                { icon: 'telegram', url: 'https://t.me/hikka' },
                null,
            ]),
        ).toEqual([{ icon: 'telegram', url: 'https://t.me/hikka' }]);
    });

    it('treats missing links as empty', () => {
        expect(parseUserLinks(undefined)).toEqual([]);
    });
});
