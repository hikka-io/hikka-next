import { UserLinkIconEnum } from '@hikka/api';

const HOST_ICONS: Record<string, UserLinkIconEnum> = {
    'bsky.app': UserLinkIconEnum.BLUESKY,
    'bsky.social': UserLinkIconEnum.BLUESKY,
    'discord.com': UserLinkIconEnum.DISCORD,
    'discord.gg': UserLinkIconEnum.DISCORD,
    'discordapp.com': UserLinkIconEnum.DISCORD,
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

// Fediverse servers have no common domain; a bare `/@name` profile path is how Mastodon, Misskey and the like address users.
const FEDIVERSE_PROFILE_PATH = /^\/@[^/]+\/?$/;

export function detectLinkIcon(value: string): UserLinkIconEnum {
    let url: URL;

    try {
        url = new URL(value.trim());
    } catch {
        return UserLinkIconEnum.CUSTOM;
    }

    const host = url.hostname.toLowerCase();
    const match = Object.entries(HOST_ICONS).find(
        ([domain]) => host === domain || host.endsWith(`.${domain}`),
    );

    if (match) return match[1];
    if (FEDIVERSE_PROFILE_PATH.test(url.pathname)) {
        return UserLinkIconEnum.FEDIVERSE;
    }

    return UserLinkIconEnum.CUSTOM;
}
