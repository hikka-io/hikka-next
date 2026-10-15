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
        ['https://www.youtube.com/@hikka', 'custom'],
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
