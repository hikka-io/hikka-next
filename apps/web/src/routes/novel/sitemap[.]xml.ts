import { createFileRoute } from '@tanstack/react-router';

import { fetchSitemapEntries, handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/novel/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'novel', (client) =>
                    fetchSitemapEntries(client, 'novel'),
                ),
        },
    },
});
