import { CompanyTypeEnum } from '@hikka/client';
import { ImageResponse } from '@takumi-rs/image-response';
import { createFileRoute } from '@tanstack/react-router';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/filter-properties';
import { createServerHikkaClient } from '@/utils/cookies/headers';
import { renderOgCard } from '@/utils/og/og-image';
import type { OgContentCardData } from '@/utils/og/og-utils';
import {
    resolveGenres,
    resolveMediaTypeLabel,
    resolveTitle,
} from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/anime')({
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
                    const anime = await client.anime.getAnimeBySlug(slug);

                    const { title, subtitle } = resolveTitle(
                        anime.title_ua,
                        anime.title_en,
                        anime.title_ja,
                    );

                    const studio = anime.companies.find(
                        (c) => c.type === CompanyTypeEnum.STUDIO,
                    );

                    const data: OgContentCardData = {
                        title,
                        subtitle,
                        image: anime.image,
                        score: anime.score,
                        mediaType: anime.media_type
                            ? resolveMediaTypeLabel(
                                  anime.media_type,
                                  ANIME_MEDIA_TYPE,
                              )
                            : null,
                        year: anime.year,
                        genres: resolveGenres(anime.genres),
                        contentTypeLabel: 'Аніме',
                        producer: studio?.company.name ?? null,
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
