import parseTextFromMarkDown from '@/utils/parse-text-from-markdown';

const jsonSchema = ({ anime }: { anime: API.AnimeInfo }) => ({
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                item: {
                    '@id': 'https://hikka.io/anime',
                    url: 'https://hikka.io/anime',
                    name: 'Аніме',
                },
            },
            {
                '@type': 'ListItem',
                position: 2,
                item: {
                    '@id': 'https://hikka.io/anime/' + anime.slug,
                    url: 'https://hikka.io/anime/' + anime.slug,
                    name: anime.title_ua || anime.title_en || anime.title_ja,
                    image: anime.poster,
                },
            },
        ],
    },
    mainEntity: {
        '@type': 'TVSeries',
        name: anime.title_ua || anime.title_en || anime.title_ja,
        alternateName: anime.synonyms,
        image: anime.poster,
        description: parseTextFromMarkDown(
            anime.synopsis_ua || anime.synopsis_en,
        ),
        startDate: anime.start_date,
        endDate: anime.end_date,
        genre: anime.genres.map((genre) => genre.name_ua),
        keywords: [],
        countryOfOrigin: 'JP',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: anime.score,
            ratingCount: anime.scored_by,
            bestRating: 10,
            worstRating: 1,
        },
        numberOfEpisodes: anime.episodes_total,
        musicBy: null,
        timeRequired: 'PT24M',
    },
});

export default jsonSchema;
