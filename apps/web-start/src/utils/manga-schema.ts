import { MangaInfoResponse } from '@hikka/client';

import { parseTextFromMarkDown } from '@/utils/markdown';

const mangaJsonSchema = ({ manga }: { manga: MangaInfoResponse }) => ({
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                item: {
                    '@id': 'https://hikka.io/manga',
                    url: 'https://hikka.io/manga',
                    name: 'Манґа',
                },
            },
            {
                '@type': 'ListItem',
                position: 2,
                item: {
                    '@id': 'https://hikka.io/manga/' + manga.slug,
                    url: 'https://hikka.io/manga/' + manga.slug,
                    name:
                        manga.title_ua ||
                        manga.title_en ||
                        manga.title_original,
                    image: manga.image,
                },
            },
        ],
    },
    mainEntity: {
        '@type': 'Book',
        name: manga.title_ua || manga.title_en || manga.title_original,
        alternateName: manga.synonyms,
        image: manga.image,
        description: parseTextFromMarkDown(
            manga.synopsis_ua || manga.synopsis_en || '',
        ),
        startDate: manga.start_date,
        endDate: manga.end_date,
        genre: manga.genres.map((genre) => genre.name_ua),
        keywords: manga.synonyms,
        countryOfOrigin: 'JP',
        ...(manga.score && manga.scored_by
            ? {
                  aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: manga.score,
                      ratingCount: manga.scored_by,
                      bestRating: 10,
                      worstRating: 1,
                  },
              }
            : {}),
        numberOfPages: manga.chapters,
    },
});

export default mangaJsonSchema;
