import { createFileRoute } from '@tanstack/react-router';

import { handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/manga/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'manga', (client) =>
                    client.sitemap.getMangaSitemap(),
                ),
        },
    },
});
