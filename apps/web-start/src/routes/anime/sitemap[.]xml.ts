import { createFileRoute } from '@tanstack/react-router';

import { fetchSitemapEntries, handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/anime/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'anime', (client) =>
                    fetchSitemapEntries(client, 'anime'),
                ),
        },
    },
});
