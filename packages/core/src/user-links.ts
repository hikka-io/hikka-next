import { UserLinkIconEnum, type UserLinkResponse } from '@hikka/api';

import { USER_LINK_ICON } from './labels';
import { parseUrl } from './url';

export const USER_LINK_REL = 'noopener noreferrer nofollow ugc';

export const getUserLinkHost = (url: URL): string =>
    url.hostname.replace(/^www\./, '');

const decodePath = (path: string): string => {
    try {
        return decodeURIComponent(path);
    } catch {
        return path;
    }
};

export function getLinkDisplayUrl(url: string): string {
    const parsed = parseUrl(url);
    if (!parsed) return url;

    return `${getUserLinkHost(parsed)}${decodePath(parsed.pathname)}`.replace(
        /\/$/,
        '',
    );
}

export function getUserLinkLabel(link: UserLinkResponse): string {
    if (link.text) return link.text;
    if (link.icon !== UserLinkIconEnum.CUSTOM) {
        return USER_LINK_ICON[link.icon].label;
    }

    const parsed = parseUrl(link.url);

    return parsed ? getUserLinkHost(parsed) : link.url;
}

// Previews the backend's user-link host check (exact host without `www.`); content links reuse it for their fallback icon.
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
