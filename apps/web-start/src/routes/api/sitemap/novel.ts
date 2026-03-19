import { createFileRoute } from '@tanstack/react-router';

import { createServerHikkaClient } from '@/utils/cookies/headers';
import { buildSitemapXml } from '@/utils/sitemap';

export const Route = createFileRoute('/api/sitemap/novel')({
    server: {
        handlers: {
            GET: async () => {
                const client = createServerHikkaClient();
                const entries = await client.sitemap.getNovelSitemap();

                return new Response(buildSitemapXml(entries, 'novel'), {
                    headers: {
                        'Content-Type': 'application/xml',
                        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                    },
                });
            },
        },
    },
});
