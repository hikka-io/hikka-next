import { ImageResponse } from '@takumi-rs/image-response';
import { createFileRoute } from '@tanstack/react-router';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants/filter-properties';
import { createServerHikkaClient } from '@/utils/cookies/headers';
import { renderOgCard } from '@/utils/og/og-image';
import type { OgContentCardData } from '@/utils/og/og-utils';
import {
    resolveGenres,
    resolveMediaTypeLabel,
    resolveTitle,
} from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/novel')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const slug = url.searchParams.get('slug');

                if (!slug) {
                    return new Response('Missing slug parameter', {
                        status: 400,
                    });
                }

                try {
                    const client = createServerHikkaClient();
                    const novel = await client.novel.getNovelBySlug(slug);

                    const { title, subtitle } = resolveTitle(
                        novel.title_ua,
                        novel.title_en,
                        novel.title_original,
                    );

                    const data: OgContentCardData = {
                        title,
                        subtitle,
                        image: novel.image,
                        score: novel.score,
                        mediaType: novel.media_type
                            ? resolveMediaTypeLabel(
                                  novel.media_type,
                                  NOVEL_MEDIA_TYPE,
                              )
                            : null,
                        year: novel.year,
                        genres: resolveGenres(novel.genres),
                        contentTypeLabel: 'Ранобе',
                        producer: novel.magazines[0]?.name_en ?? null,
                    };

                    return new ImageResponse(renderOgCard(data), {
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
            },
        },
    },
});
