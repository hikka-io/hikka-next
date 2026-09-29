import type {
    AnimeInfoResponse,
    ArticleDocumentResponse,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/api';

import { parseTextFromMarkDown } from '@/utils/markdown';
import { SITE_ORIGIN } from '@/utils/url';

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

export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(
        /[<\u2028\u2029]/g,
        (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );

export const websiteJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hikka',
    url: SITE_ORIGIN,
    description: 'Українська онлайн енциклопедія аніме, манґи та ранобе',
    inLanguage: 'uk',
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_ORIGIN}/anime?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
    publisher: {
        '@type': 'Organization',
        name: 'Hikka',
        url: SITE_ORIGIN,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_ORIGIN}/logo-icon.png`,
        },
    },
});

export const articleJsonLd = (article: ArticleDocumentResponse) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    author: {
        '@type': 'Person',
        name: article.author.username,
    },
    publisher: {
        '@type': 'Organization',
        name: 'Hikka',
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_ORIGIN}/logo-icon.png`,
        },
    },
    datePublished: article.created,
    dateModified: article.updated || article.created,
});

/** JSON-LD (schema.org) document for an anime/manga/novel detail page. */
export const contentJsonLd = ({
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
                        '@id': `${SITE_ORIGIN}/${contentType}`,
                        url: `${SITE_ORIGIN}/${contentType}`,
                        name: config.name,
                    },
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    item: {
                        '@id': `${SITE_ORIGIN}/${contentType}/${content.slug}`,
                        url: `${SITE_ORIGIN}/${contentType}/${content.slug}`,
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
