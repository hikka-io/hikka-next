import { describe, expect, it } from 'vitest';

import {
    detectLinkIcon,
    getUserLinkDisplayUrl,
    getUserLinkLabel,
} from './user-links';

describe('getUserLinkDisplayUrl', () => {
    it('drops the scheme, www and a trailing slash', () => {
        expect(getUserLinkDisplayUrl('https://www.github.com/hikka/')).toBe(
            'github.com/hikka',
        );
    });

    it('decodes a percent-encoded path', () => {
        expect(
            getUserLinkDisplayUrl(
                'https://uk.wikipedia.org/wiki/%D0%A5%D1%96%D0%BA%D0%BA%D0%B0',
            ),
        ).toBe('uk.wikipedia.org/wiki/Хікка');
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
            getUserLinkLabel({
                icon: 'twitter',
                url: 'https://x.com/hikka',
                text: null,
            }),
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

describe('detectLinkIcon', () => {
    it.each([
        ['https://github.com/hikka-io', 'github'],
        ['https://gist.github.com/hikka', 'custom'],
        ['https://www.instagram.com/hikka', 'instagram'],
        ['https://t.me/hikka_io', 'telegram'],
        ['https://x.com/hikka', 'twitter'],
        ['https://twitter.com/hikka', 'twitter'],
        ['https://discord.gg/hikka', 'discord'],
        ['https://hikka.bsky.social', 'custom'],
        ['https://bsky.social/hikka', 'bluesky'],
        ['https://bsky.app/profile/hikka', 'bluesky'],
        ['https://www.threads.net/@hikka', 'threads'],
        ['https://steamcommunity.com/id/hikka', 'steam'],
        ['https://www.youtube.com/@hikka', 'youtube'],
        ['https://www.reddit.com/u/hikka', 'reddit'],
        ['https://youtu.be/hikka', 'youtube'],
        ['https://m.youtube.com/@hikka', 'custom'],
        ['https://www.chess.com/member/hikka', 'chess'],
        ['https://lichess.org/@/hikka', 'custom'],
        ['https://manga.in.ua/user/hikka', 'mangainua'],
        ['https://mangalist.in.ua/user/hikka', 'mangalist'],
        ['https://anitube.in.ua/user/hikka', 'anitube'],
        ['https://dgmanga.app/user/hikka', 'dgmanga'],
        ['https://mikai.me/user/hikka', 'mikai'],
        ['https://zenko.online/users/hikka', 'zenko'],
        ['https://www.tiktok.com/@hikka', 'custom'],
        ['https://medium.com/@hikka', 'custom'],
        ['https://myanimelist.net/profile/hikka', 'custom'],
        ['https://notgithub.com/hikka', 'custom'],
        ['https://constructor/hikka', 'custom'],
        ['github.com/hikka', 'custom'],
    ])('%s is %s', (url, icon) => {
        expect(detectLinkIcon(url)).toBe(icon);
    });
});
