import { type ExternalResponse, ExternalTypeEnum } from '@hikka/api';

import { parseUrl } from './url';

// MAL labels a title's official homepage "Official Site"; it is the one homepage link worth showing.
const OFFICIAL_SITE_PREFIX = 'official';

const dedupeByUrl = (links: ExternalResponse[]) =>
    Array.from(new Map(links.map((link) => [link.url, link])).values());

const isWebUrl = (url: URL) =>
    url.protocol === 'https:' || url.protocol === 'http:';

const isHomepage = (url: URL) =>
    url.pathname === '/' && !url.search && !url.hash;

const isOfficialSite = (link: ExternalResponse) =>
    link.text.trim().toLowerCase().startsWith(OFFICIAL_SITE_PREFIX);

const isUsableLink = (link: ExternalResponse) => {
    const url = parseUrl(link.url);
    if (!url || !isWebUrl(url)) return false;

    return !isHomepage(url) || isOfficialSite(link);
};

/**
 * General links for everyone; watch/read links only for a signed-in viewer
 * (`withWatch`), because the hosts need an account. Non-web URLs and bare
 * platform homepages are dropped.
 */
export function groupExternalLinks(
    external: ExternalResponse[],
    { withWatch }: { withWatch: boolean },
) {
    const usable = external.filter(isUsableLink);

    return {
        general: dedupeByUrl(
            usable.filter((link) => link.type === ExternalTypeEnum.GENERAL),
        ),
        watch: withWatch
            ? dedupeByUrl(
                  usable.filter(
                      (link) =>
                          link.type === ExternalTypeEnum.WATCH ||
                          link.type === ExternalTypeEnum.READ,
                  ),
              )
            : [],
    };
}
