import { HikkaClient, SitemapResponse } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { createServerHikkaClient } from '@/utils/cookies/headers';
import {
    SITEMAP_RESPONSE_HEADERS,
    SitemapIndexEntry,
    buildSitemapIndexXml,
    getSitemapPageCount,
    getSlicedLastmod,
    paginateSitemap,
} from '@/utils/sitemap';
import { getSiteUrl } from '@/utils/url';

const TYPES: {
    path: 'anime' | 'manga' | 'novel';
    fetch: (client: HikkaClient) => Promise<SitemapResponse[]>;
}[] = [
    { path: 'anime', fetch: (c) => c.sitemap.getAnimeSitemap() },
    { path: 'manga', fetch: (c) => c.sitemap.getMangaSitemap() },
    { path: 'novel', fetch: (c) => c.sitemap.getNovelSitemap() },
];

export const Route = createFileRoute('/sitemap.xml')({
    server: {
        handlers: {
            GET: async () => {
                const client = createServerHikkaClient();
                const siteUrl = getSiteUrl();

                const typeEntries = await Promise.all(
                    TYPES.map(async ({ path, fetch }) => ({
                        path,
                        entries: await fetch(client),
                    })),
                );

                const indexEntries: SitemapIndexEntry[] = typeEntries.flatMap(
                    ({ path, entries }) => {
                        const pageCount = getSitemapPageCount(entries);
                        return Array.from({ length: pageCount }, (_, i) => {
                            const page = i + 1;
                            const slice = paginateSitemap(entries, page) ?? [];
                            return {
                                loc: `${siteUrl}/${path}/sitemap.xml?page=${page}`,
                                lastmod: getSlicedLastmod(slice),
                            };
                        });
                    },
                );

                return new Response(buildSitemapIndexXml(indexEntries), {
                    headers: SITEMAP_RESPONSE_HEADERS,
                });
            },
        },
    },
});
