import type {
    AnimeInfoResponse,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/api';

import { parseTextFromMarkDown } from '@/utils/markdown';

type ContentSchemaType = 'anime' | 'manga' | 'novel';

const SCHEMA_CONFIG: Record<
    ContentSchemaType,
    {
        name: string;
        subtitleKey: 'title_ja' | 'title_original';
        entityType: 'TVSeries' | 'Book';
    }
> = {
    anime: { name: 'Аніме', subtitleKey: 'title_ja', entityType: 'TVSeries' },
    manga: { name: 'Манґа', subtitleKey: 'title_original', entityType: 'Book' },
    novel: {
        name: 'Ранобе',
        subtitleKey: 'title_original',
        entityType: 'Book',
    },
};

/** JSON-LD (schema.org) document for an anime/manga/novel detail page. */
const contentJsonSchema = ({
    content,
    contentType,
}: {
    content: AnimeInfoResponse | MangaInfoResponse | NovelInfoResponse;
    contentType: ContentSchemaType;
}) => {
    const config = SCHEMA_CONFIG[contentType];
    const subtitle = (content as unknown as Record<string, string | null>)[
        config.subtitleKey
    ];
    const title = content.title_ua || content.title_en || subtitle;

    const entityDetails =
        contentType === 'anime'
            ? {
                  numberOfEpisodes: (content as AnimeInfoResponse)
                      .episodes_total,
                  musicBy: null,
                  timeRequired: 'PT24M',
              }
            : {
                  numberOfPages: (
                      content as MangaInfoResponse | NovelInfoResponse
                  ).chapters,
              };

    return {
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    item: {
                        '@id': `https://hikka.io/${contentType}`,
                        url: `https://hikka.io/${contentType}`,
                        name: config.name,
                    },
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    item: {
                        '@id': `https://hikka.io/${contentType}/${content.slug}`,
                        url: `https://hikka.io/${contentType}/${content.slug}`,
                        name: title,
                        image: content.image,
                    },
                },
            ],
        },
        mainEntity: {
            '@type': config.entityType,
            name: title,
            alternateName: content.synonyms,
            image: content.image,
            description: parseTextFromMarkDown(
                content.synopsis_ua || content.synopsis_en || '',
            ),
            startDate: content.start_date,
            endDate: content.end_date,
            genre: content.genres.map((genre) => genre.name_ua),
            keywords: content.synonyms,
            countryOfOrigin: 'JP',
            ...(content.score && content.scored_by
                ? {
                      aggregateRating: {
                          '@type': 'AggregateRating',
                          ratingValue: content.score,
                          ratingCount: content.scored_by,
                          bestRating: 10,
                          worstRating: 1,
                      },
                  }
                : {}),
            ...entityDetails,
        },
    };
};

export default contentJsonSchema;
