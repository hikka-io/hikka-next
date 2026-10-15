import { type UserLink, UserLinkIconEnum } from '@hikka/api';

import { USER_LINK_ICON } from '@/utils/labels';

/** The host and path of a link without the scheme, `www.` or a trailing slash. */
export function getUserLinkDisplayUrl(url: string): string {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');

        return `${host}${parsed.pathname}`.replace(/\/$/, '');
    } catch {
        return url;
    }
}

/** The owner's text, else the service name, else the host for a custom link. */
export function getUserLinkLabel(link: UserLink): string {
    if (link.text) return link.text;
    if (link.icon !== UserLinkIconEnum.CUSTOM) {
        return USER_LINK_ICON[link.icon].label;
    }

    return getUserLinkDisplayUrl(link.url).split('/')[0];
}
