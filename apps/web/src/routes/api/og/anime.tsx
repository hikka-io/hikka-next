import { createFileRoute } from '@tanstack/react-router';

import { animeSlug, CompanyTypeEnum } from '@hikka/api';

import { ANIME_MEDIA_TYPE } from '@/utils/constants/filter-properties';
import { createOgImageHandler } from '@/utils/og/create-og-handler';
import {
    resolveGenres,
    resolveMediaTypeLabel,
    resolveTitle,
} from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/anime')({
    server: {
        handlers: {
            GET: createOgImageHandler({
                fetchContent: async (slug, client) => {
                    const { data } = await animeSlug({
                        client,
                        path: { slug },
                        throwOnError: true,
                    });
                    return data;
                },
                buildCard: (anime) => {
                    const { title, subtitle } = resolveTitle(
                        anime.title_ua,
                        anime.title_en,
                        anime.title_ja,
                    );

                    const studio = anime.companies.find(
                        (c) => c.type === CompanyTypeEnum.STUDIO,
                    );

                    return {
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
                },
            }),
        },
    },
});
