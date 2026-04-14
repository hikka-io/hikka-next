import { createFileRoute } from '@tanstack/react-router';

import { handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/anime/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'anime', (client) =>
                    client.sitemap.getAnimeSitemap(),
                ),
        },
    },
});
