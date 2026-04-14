import { createFileRoute } from '@tanstack/react-router';

import { handleTypeSitemapRequest } from '@/utils/sitemap';

export const Route = createFileRoute('/novel/sitemap.xml')({
    server: {
        handlers: {
            GET: ({ request }) =>
                handleTypeSitemapRequest(request, 'novel', (client) =>
                    client.sitemap.getNovelSitemap(),
                ),
        },
    },
});
