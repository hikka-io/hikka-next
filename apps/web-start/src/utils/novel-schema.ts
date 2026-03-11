import { NovelInfoResponse } from '@hikka/client';

import { parseTextFromMarkDown } from '@/utils/markdown';

const novelJsonSchema = ({ novel }: { novel: NovelInfoResponse }) => ({
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                item: {
                    '@id': 'https://hikka.io/novel',
                    url: 'https://hikka.io/novel',
                    name: 'Ранобе',
                },
            },
            {
                '@type': 'ListItem',
                position: 2,
                item: {
                    '@id': 'https://hikka.io/novel/' + novel.slug,
                    url: 'https://hikka.io/novel/' + novel.slug,
                    name:
                        novel.title_ua ||
                        novel.title_en ||
                        novel.title_original,
                    image: novel.image,
                },
            },
        ],
    },
    mainEntity: {
        '@type': 'Book',
        name: novel.title_ua || novel.title_en || novel.title_original,
        alternateName: novel.synonyms,
        image: novel.image,
        description: parseTextFromMarkDown(
            novel.synopsis_ua || novel.synopsis_en || '',
        ),
        startDate: novel.start_date,
        endDate: novel.end_date,
        genre: novel.genres.map((genre) => genre.name_ua),
        keywords: novel.synonyms,
        countryOfOrigin: 'JP',
        ...(novel.score && novel.scored_by
            ? {
                  aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: novel.score,
                      ratingCount: novel.scored_by,
                      bestRating: 10,
                      worstRating: 1,
                  },
              }
            : {}),
        numberOfPages: novel.chapters,
    },
});

export default novelJsonSchema;
