import { type ExternalResponse, ExternalTypeEnum } from '@hikka/api';

const dedupeByUrl = (links: ExternalResponse[]) =>
    Array.from(new Map(links.map((link) => [link.url, link])).values());

/**
 * General links for everyone; watch/read links only for a signed-in viewer
 * (`withWatch`), because the hosts need an account.
 */
export function groupExternalLinks(
    external: ExternalResponse[],
    { withWatch }: { withWatch: boolean },
) {
    return {
        general: dedupeByUrl(
            external.filter((link) => link.type === ExternalTypeEnum.GENERAL),
        ),
        watch: withWatch
            ? dedupeByUrl(
                  external.filter(
                      (link) =>
                          link.type === ExternalTypeEnum.WATCH ||
                          link.type === ExternalTypeEnum.READ,
                  ),
              )
            : [],
    };
}
