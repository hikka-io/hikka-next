import { UserLinkIconEnum } from '@hikka/api';

import { parseUrl } from '@/utils/url';
import { getUserLinkHost } from '@/utils/user-links';

// Mirrors the backend's host check for each icon (exact host without `www.`); any other host is rejected for that icon.
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
};

// Fediverse servers share no domain, so a bare `/@name` path stands for a fediverse profile, except on these sites that use the same shape.
const FEDIVERSE_PROFILE_PATH = /^\/@[^/]+\/?$/;
const NOT_FEDIVERSE_HOSTS = new Set([
    'youtube.com',
    'm.youtube.com',
    'tiktok.com',
    'medium.com',
]);

export function detectLinkIcon(value: string): UserLinkIconEnum {
    const url = parseUrl(value.trim());
    if (!url) return UserLinkIconEnum.CUSTOM;

    const host = getUserLinkHost(url);

    if (Object.hasOwn(HOST_ICONS, host)) return HOST_ICONS[host];
    if (
        FEDIVERSE_PROFILE_PATH.test(url.pathname) &&
        !NOT_FEDIVERSE_HOSTS.has(host)
    ) {
        return UserLinkIconEnum.FEDIVERSE;
    }

    return UserLinkIconEnum.CUSTOM;
}
