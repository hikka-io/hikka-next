import { createFileRoute } from '@tanstack/react-router';

import { buildSitemapIndexXml } from '@/utils/sitemap';

const SITEMAP_RESPONSE_HEADERS = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
};

export const Route = createFileRoute('/api/sitemap/')({
    server: {
        handlers: {
            GET: async () => {
                const xml = buildSitemapIndexXml([
                    'https://hikka.io/api/sitemap/anime',
                    'https://hikka.io/api/sitemap/manga',
                    'https://hikka.io/api/sitemap/novel',
                ]);

                return new Response(xml, {
                    headers: SITEMAP_RESPONSE_HEADERS,
                });
            },
        },
    },
});
