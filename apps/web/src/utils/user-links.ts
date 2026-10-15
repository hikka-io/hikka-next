import { UserLinkIconEnum, type UserLinkResponse } from '@hikka/api';

import { USER_LINK_ICON } from '@/utils/labels';
import { parseUrl } from '@/utils/url';

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

export function getUserLinkDisplayUrl(url: string): string {
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
