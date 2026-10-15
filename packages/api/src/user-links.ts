import type { UserLinkResponse } from './gen';

const WEB_PROTOCOLS = new Set(['http:', 'https:']);

export function isWebUrl(value: string): boolean {
    try {
        return WEB_PROTOCOLS.has(new URL(value).protocol);
    } catch {
        return false;
    }
}

/** Keeps only http(s) links; the response schema admits any string, `javascript:` URLs included. */
export function parseUserLinks(
    links: readonly UserLinkResponse[] | undefined,
): UserLinkResponse[] {
    return (links ?? []).filter((link) => isWebUrl(link.url));
}
