import { createFileRoute } from '@tanstack/react-router';

import { createServerHikkaClient } from '@/utils/cookies/headers';
import {
    buildSitemapIndexXml,
    fetchSitemapEntries,
    getSitemapPageCount,
    getSlicedLastmod,
    paginateSitemap,
    SITEMAP_RESPONSE_HEADERS,
    type SitemapIndexEntry,
} from '@/utils/sitemap';
import { getSiteUrl } from '@/utils/url';

const TYPES: ('anime' | 'manga' | 'novel')[] = ['anime', 'manga', 'novel'];

export const Route = createFileRoute('/sitemap.xml')({
    server: {
        handlers: {
            GET: async () => {
                const client = createServerHikkaClient();
                const siteUrl = getSiteUrl();

                const typeEntries = await Promise.all(
                    TYPES.map(async (path) => ({
                        path,
                        entries: await fetchSitemapEntries(client, path),
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
