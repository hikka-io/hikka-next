import { createFileRoute } from '@tanstack/react-router';

import { fetchSitemapEntries, handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/manga/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'manga', (client) =>
                    fetchSitemapEntries(client, 'manga'),
                ),
        },
    },
});
