import type {
    AnimeInfoResponse,
    ArticleDocumentResponse,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/api';
import { parseTextFromMarkDown } from '@hikka/core';

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

const toIsoDateTime = (seconds: number | null) =>
    seconds ? new Date(seconds * 1000).toISOString() : undefined;

const toIsoDate = (seconds: number | null) =>
    toIsoDateTime(seconds)?.slice(0, 10);

export const serializeJsonLd = (data: object): string =>
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
    datePublished: toIsoDateTime(article.created),
    dateModified: toIsoDateTime(article.updated || article.created),
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

    const anime =
        contentType === 'anime' ? (content as AnimeInfoResponse) : null;
    const entityDetails = anime
        ? {
              numberOfEpisodes: anime.episodes_total,
              timeRequired: anime.duration ? `PT${anime.duration}M` : undefined,
          }
        : {};

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
            startDate: toIsoDate(content.start_date),
            endDate: toIsoDate(content.end_date),
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
