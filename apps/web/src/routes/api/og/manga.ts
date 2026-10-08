import { createFileRoute } from '@tanstack/react-router';

import { mangaInfo } from '@hikka/api';

import { getMediaTypeLabel } from '@/utils/labels';
import { createOgImageHandler } from '@/utils/og/create-og-handler';
import { resolveGenres, resolveTitle } from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/manga')({
    server: {
        handlers: {
            GET: createOgImageHandler({
                fetchContent: async (slug, client) => {
                    const { data } = await mangaInfo({
                        client,
                        path: { slug },
                        throwOnError: true,
                    });
                    return data;
                },
                buildCard: (manga) => {
                    const { title, subtitle } = resolveTitle(
                        manga.title_ua,
                        manga.title_en,
                        manga.title_original,
                    );

                    return {
                        title,
                        subtitle,
                        image: manga.image,
                        score: manga.score,
                        mediaType: getMediaTypeLabel(manga.media_type) ?? null,
                        year: manga.year,
                        genres: resolveGenres(manga.genres),
                        contentTypeLabel: 'Манґа',
                        producer: manga.magazines[0]?.name_en ?? null,
                    };
                },
            }),
        },
    },
});
