import { ImageResponse } from '@takumi-rs/image-response';
import { createFileRoute } from '@tanstack/react-router';

import { MANGA_MEDIA_TYPE } from '@/utils/constants/filter-properties';
import { createServerHikkaClient } from '@/utils/cookies/headers';
import { renderOgCard } from '@/utils/og/og-image';
import type { OgContentCardData } from '@/utils/og/og-utils';
import {
    resolveGenres,
    resolveMediaTypeLabel,
    resolveTitle,
} from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/manga')({
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
                    const manga = await client.manga.getMangaBySlug(slug);

                    const { title, subtitle } = resolveTitle(
                        manga.title_ua,
                        manga.title_en,
                        manga.title_original,
                    );

                    const data: OgContentCardData = {
                        title,
                        subtitle,
                        image: manga.image,
                        score: manga.score,
                        mediaType: manga.media_type
                            ? resolveMediaTypeLabel(
                                  manga.media_type,
                                  MANGA_MEDIA_TYPE,
                              )
                            : null,
                        year: manga.year,
                        genres: resolveGenres(manga.genres),
                        contentTypeLabel: 'Манґа',
                        producer: manga.magazines[0]?.name_en ?? null,
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
