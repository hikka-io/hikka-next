import { describe, expect, it } from 'vitest';

import { getUserLinkDisplayUrl, getUserLinkLabel } from './user-links';

describe('getUserLinkDisplayUrl', () => {
    it('drops the scheme, www and a trailing slash', () => {
        expect(getUserLinkDisplayUrl('https://www.github.com/hikka/')).toBe(
            'github.com/hikka',
        );
    });

    it('returns an unparsable value as is', () => {
        expect(getUserLinkDisplayUrl('hikka')).toBe('hikka');
    });
});

describe('getUserLinkLabel', () => {
    it('prefers the owner text', () => {
        expect(
            getUserLinkLabel({
                icon: 'github',
                url: 'https://github.com/hikka',
                text: 'Код',
            }),
        ).toBe('Код');
    });

    it('falls back to the service name', () => {
        expect(
            getUserLinkLabel({ icon: 'twitter', url: 'https://x.com/hikka' }),
        ).toBe('X');
    });

    it('falls back to the host for a custom link', () => {
        expect(
            getUserLinkLabel({
                icon: 'custom',
                url: 'https://www.myanimelist.net/profile/hikka',
                text: null,
            }),
        ).toBe('myanimelist.net');
    });
});
