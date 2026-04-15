import { ExternalResponse, ExternalTypeEnum } from '@hikka/client';

/**
 * Removes watch/read URLs from a content response so they never end up in the
 * dehydrated query cache for anonymous visitors. Those links are only meant
 * to be visible to authenticated users; keeping them out of the server-rendered
 * HTML prevents them from being scraped from the page source.
 */
export function stripRestrictedExternal<
    T extends { external: ExternalResponse[] },
>(content: T): T {
    return {
        ...content,
        external: content.external.filter(
            (link) => link.type === ExternalTypeEnum.GENERAL,
        ),
    };
}
