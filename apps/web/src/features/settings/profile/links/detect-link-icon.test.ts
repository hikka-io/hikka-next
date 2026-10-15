import { describe, expect, it } from 'vitest';

import { detectLinkIcon } from './detect-link-icon';

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
