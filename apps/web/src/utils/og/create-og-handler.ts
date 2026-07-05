import { ImageResponse } from '@takumi-rs/image-response';

import { createServerHikkaClient } from '@/utils/cookies/headers';
import { renderOgCard } from '@/utils/og/og-image';
import type { OgContentCardData } from '@/utils/og/og-utils';

type ServerClient = ReturnType<typeof createServerHikkaClient>;

/**
 * Builds a GET handler for an `/api/og/*` route: parses the `slug` param,
 * fetches the content, renders the shared OG card, and applies the common
 * 1200x630 JPEG + cache-control response. Per-type routes only supply how to
 * fetch the content and how to map it onto the card.
 */
export function createOgImageHandler<T>(config: {
    fetchContent: (slug: string, client: ServerClient) => Promise<T>;
    buildCard: (content: T) => OgContentCardData;
}) {
    return async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return new Response('Missing slug parameter', { status: 400 });
        }

        try {
            const client = createServerHikkaClient();
            const content = await config.fetchContent(slug, client);

            return new ImageResponse(renderOgCard(config.buildCard(content)), {
                width: 1200,
                height: 630,
                format: 'jpeg',
                headers: {
                    'Cache-Control':
                        'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
                },
            });
        } catch {
            return new Response('Content not found', { status: 404 });
        }
    };
}
