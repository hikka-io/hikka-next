import type { UserLink } from './gen';
import { zUserLink } from './gen/zod.gen';

const WEB_PROTOCOLS = new Set(['http:', 'https:']);

/** Narrows the loosely typed `links` of a user response, dropping entries that are not a valid web `UserLink` (the schema alone admits `javascript:` URLs). */
export function parseUserLinks(
    links: readonly unknown[] | undefined,
): UserLink[] {
    return (links ?? []).flatMap((link) => {
        const parsed = zUserLink.safeParse(link);
        return parsed.success &&
            WEB_PROTOCOLS.has(new URL(parsed.data.url).protocol)
            ? [parsed.data]
            : [];
    });
}
