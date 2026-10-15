import { describe, expect, it } from 'vitest';

import { detectLinkIcon } from './detect-link-icon';

describe('detectLinkIcon', () => {
    it.each([
        ['https://github.com/hikka-io', 'github'],
        ['https://gist.github.com/hikka', 'github'],
        ['https://www.instagram.com/hikka', 'instagram'],
        ['https://t.me/hikka_io', 'telegram'],
        ['https://x.com/hikka', 'twitter'],
        ['https://twitter.com/hikka', 'twitter'],
        ['https://discord.gg/hikka', 'discord'],
        ['https://hikka.bsky.social', 'bluesky'],
        ['https://bsky.app/profile/hikka', 'bluesky'],
        ['https://www.threads.net/@hikka', 'threads'],
        ['https://steamcommunity.com/id/hikka', 'steam'],
        ['https://mastodon.social/@hikka', 'fediverse'],
        ['https://myanimelist.net/profile/hikka', 'custom'],
        ['https://notgithub.com/hikka', 'custom'],
        ['github.com/hikka', 'custom'],
    ])('%s is %s', (url, icon) => {
        expect(detectLinkIcon(url)).toBe(icon);
    });
});
