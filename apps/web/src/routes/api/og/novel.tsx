import { createFileRoute } from '@tanstack/react-router';

import { novelInfo } from '@hikka/api';

import { NOVEL_MEDIA_TYPE } from '@/utils/constants/filter-properties';
import { createOgImageHandler } from '@/utils/og/create-og-handler';
import {
    resolveGenres,
    resolveMediaTypeLabel,
    resolveTitle,
} from '@/utils/og/og-utils';

export const Route = createFileRoute('/api/og/novel')({
    server: {
        handlers: {
            GET: createOgImageHandler({
                fetchContent: async (slug, client) => {
                    const { data } = await novelInfo({
                        client,
                        path: { slug },
                        throwOnError: true,
                    });
                    return data;
                },
                buildCard: (novel) => {
                    const { title, subtitle } = resolveTitle(
                        novel.title_ua,
                        novel.title_en,
                        novel.title_original,
                    );

                    return {
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
                },
            }),
        },
    },
});
