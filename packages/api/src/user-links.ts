import type { UserLink } from './gen';
import { zUserLink } from './gen/zod.gen';

const WEB_PROTOCOLS = new Set(['http:', 'https:']);

export function isWebUrl(value: string): boolean {
    try {
        return WEB_PROTOCOLS.has(new URL(value).protocol);
    } catch {
        return false;
    }
}

/** Narrows the loosely typed `links` of a user response; the schema alone admits `javascript:` URLs. */
export function parseUserLinks(
    links: readonly unknown[] | undefined,
): UserLink[] {
    return (links ?? []).flatMap((link) => {
        const parsed = zUserLink.safeParse(link);
        return parsed.success && isWebUrl(parsed.data.url) ? [parsed.data] : [];
    });
}
