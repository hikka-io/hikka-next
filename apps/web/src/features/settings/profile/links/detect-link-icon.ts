import { UserLinkIconEnum } from '@hikka/api';

import { parseUrl } from '@/utils/url';
import { getUserLinkHost } from '@/utils/user-links';

// Previews the backend's host check (exact host without `www.`); the saved icon always comes from the backend.
const HOST_ICONS: Record<string, UserLinkIconEnum> = {
    'bsky.app': UserLinkIconEnum.BLUESKY,
    'bsky.social': UserLinkIconEnum.BLUESKY,
    'discord.com': UserLinkIconEnum.DISCORD,
    'discord.gg': UserLinkIconEnum.DISCORD,
    'github.com': UserLinkIconEnum.GITHUB,
    'instagram.com': UserLinkIconEnum.INSTAGRAM,
    'steamcommunity.com': UserLinkIconEnum.STEAM,
    't.me': UserLinkIconEnum.TELEGRAM,
    'telegram.me': UserLinkIconEnum.TELEGRAM,
    'threads.com': UserLinkIconEnum.THREADS,
    'threads.net': UserLinkIconEnum.THREADS,
    'twitter.com': UserLinkIconEnum.TWITTER,
    'x.com': UserLinkIconEnum.TWITTER,
    'youtube.com': UserLinkIconEnum.YOUTUBE,
    'youtu.be': UserLinkIconEnum.YOUTUBE,
    'reddit.com': UserLinkIconEnum.REDDIT,
    'chess.com': UserLinkIconEnum.CHESS,
    'manga.in.ua': UserLinkIconEnum.MANGAINUA,
    'mangalist.in.ua': UserLinkIconEnum.MANGALIST,
    'dgmanga.app': UserLinkIconEnum.DGMANGA,
    'zenko.online': UserLinkIconEnum.ZENKO,
    'anitube.in.ua': UserLinkIconEnum.ANITUBE,
    'mikai.me': UserLinkIconEnum.MIKAI,
};

export function detectLinkIcon(value: string): UserLinkIconEnum {
    const url = parseUrl(value.trim());
    if (!url) return UserLinkIconEnum.CUSTOM;

    const host = getUserLinkHost(url);

    return Object.hasOwn(HOST_ICONS, host)
        ? HOST_ICONS[host]
        : UserLinkIconEnum.CUSTOM;
}
