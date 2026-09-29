import { describe, expect, it } from 'vitest';

import type {
    AnimeInfoResponse,
    ArticleDocumentResponse,
    MangaInfoResponse,
    NovelInfoResponse,
} from '@hikka/api';

import {
    articleJsonLd,
    contentJsonLd,
    serializeJsonLd,
    websiteJsonLd,
} from './json-ld';

const payload = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '</script><img src=x onerror=alert(1)>',
    author: {
        '@type': 'Person',
        name: 'He said "hi" & \'bye\' \\ </SCRIPT >',
    },
    keywords: [
        'Атака титанів',
        '進撃の巨人',
        '🎌',
        'line\u2028sep',
        'para\u2029sep',
    ],
    nested: { deeper: [{ text: '<!-- hidden --> <b>bold</b>' }] },
    count: 12,
    flag: true,
    missing: null,
};

describe('serializeJsonLd', () => {
    it('round-trips to the same value', () => {
        expect(JSON.parse(serializeJsonLd(payload))).toEqual(payload);
    });

    it('emits no raw < so the data cannot close the script tag', () => {
        const serialized = serializeJsonLd(payload);

        expect(serialized).not.toContain('<');
        expect(serialized).toContain('\\u003c/script>');
    });

    it('neutralises html comment sequences', () => {
        const serialized = serializeJsonLd({ text: '<!-- a --> b <!--' });

        expect(serialized).not.toContain('<');
        expect(serialized).not.toContain('<!--');
        expect(serialized).toContain('\\u003c!--');
        expect(JSON.parse(serialized)).toEqual({ text: '<!-- a --> b <!--' });
    });

    it('escapes line and paragraph separators', () => {
        const serialized = serializeJsonLd({ text: 'a\u2028b\u2029c' });

        expect(serialized).not.toMatch(/[\u2028\u2029]/);
        expect(serialized).toBe('{"text":"a\\u2028b\\u2029c"}');
    });
});

const ANIME = {
    slug: 'akira-8e242d',
    title_ua: 'Акіра <b>',
    title_en: 'Akira',
    title_ja: 'AKIRA',
    synonyms: ['Akira 1988', 'アキラ'],
    image: 'https://cdn.hikka.io/content/anime/akira.jpg',
    synopsis_ua:
        'Минув **31 рік** після [війни](https://hikka.io/x).\n\nНео-Токіо & </script> "лапки"',
    synopsis_en: 'English synopsis',
    start_date: 584150400,
    end_date: 584150400,
    genres: [{ name_ua: 'Екшн' }, { name_ua: 'Фантастика' }],
    score: 8.1,
    scored_by: 12345,
    episodes_total: 1,
} as unknown as AnimeInfoResponse;

const UNTITLED_ANIME = {
    slug: 'no-title-abc123',
    title_ua: null,
    title_en: null,
    title_ja: 'タイトル',
    synonyms: [],
    image: null,
    synopsis_ua: null,
    synopsis_en: null,
    start_date: null,
    end_date: null,
    genres: [],
    score: 0,
    scored_by: 0,
    episodes_total: null,
} as unknown as AnimeInfoResponse;

const MANGA = {
    slug: 'berserk-fb9fbd',
    title_ua: null,
    title_en: 'Berserk',
    title_original: 'ベルセルク',
    synonyms: ['Берсерк'],
    image: 'https://cdn.hikka.io/content/manga/berserk.jpg',
    synopsis_ua: null,
    synopsis_en: 'Guts, a *former* mercenary.',
    start_date: 619315200,
    end_date: null,
    genres: [{ name_ua: 'Фентезі' }],
    score: 9.47,
    scored_by: 0,
    chapters: 380,
} as unknown as MangaInfoResponse;

const NOVEL = {
    slug: 'omniscient-readers-viewpoint-03471e',
    title_ua: null,
    title_en: null,
    title_original: '전지적 독자 시점',
    synonyms: ['ORV'],
    image: 'https://cdn.hikka.io/content/novel/orv.jpg',
    synopsis_ua: '# Заголовок\n\n- пункт один\n- пункт два',
    synopsis_en: null,
    start_date: 1517443200,
    end_date: 1580515200,
    genres: [{ name_ua: 'Екшн' }, { name_ua: 'Драма' }],
    score: 8.9,
    scored_by: 4321,
    chapters: null,
} as unknown as NovelInfoResponse;

const article = (fields: {
    title: string;
    username: string;
    created: number;
    updated: number;
}) =>
    ({
        title: fields.title,
        author: { username: fields.username },
        created: fields.created,
        updated: fields.updated,
    }) as unknown as ArticleDocumentResponse;

describe('websiteJsonLd', () => {
    it('serializes the site-wide WebSite document', () => {
        expect(serializeJsonLd(websiteJsonLd())).toBe(
            '{"@context":"https://schema.org","@type":"WebSite","name":"Hikka","url":"https://hikka.io","description":"Українська онлайн енциклопедія аніме, манґи та ранобе","inLanguage":"uk","potentialAction":{"@type":"SearchAction","target":"https://hikka.io/anime?search={search_term_string}","query-input":"required name=search_term_string"},"publisher":{"@type":"Organization","name":"Hikka","url":"https://hikka.io","logo":{"@type":"ImageObject","url":"https://hikka.io/logo-icon.png"}}}',
        );
    });
});

describe('articleJsonLd', () => {
    it('serializes an edited article', () => {
        expect(
            serializeJsonLd(
                articleJsonLd(
                    article({
                        title: 'У пошуках "детективів" </script>',
                        username: 'm__ka',
                        created: 1789207221,
                        updated: 1789240015,
                    }),
                ),
            ),
        ).toBe(
            String.raw`{"@context":"https://schema.org","@type":"Article","headline":"У пошуках \"детективів\" \u003c/script>","author":{"@type":"Person","name":"m__ka"},"publisher":{"@type":"Organization","name":"Hikka","logo":{"@type":"ImageObject","url":"https://hikka.io/logo-icon.png"}},"datePublished":1789207221,"dateModified":1789240015}`,
        );
    });

    it('falls back to the created date when never updated', () => {
        expect(
            serializeJsonLd(
                articleJsonLd(
                    article({
                        title: 'Правила сайту',
                        username: 'olexh',
                        created: 1700000000,
                        updated: 0,
                    }),
                ),
            ),
        ).toBe(
            '{"@context":"https://schema.org","@type":"Article","headline":"Правила сайту","author":{"@type":"Person","name":"olexh"},"publisher":{"@type":"Organization","name":"Hikka","logo":{"@type":"ImageObject","url":"https://hikka.io/logo-icon.png"}},"datePublished":1700000000,"dateModified":1700000000}',
        );
    });
});

describe('contentJsonLd', () => {
    it('serializes an anime with its rating', () => {
        expect(
            serializeJsonLd(
                contentJsonLd({ content: ANIME, contentType: 'anime' }),
            ),
        ).toBe(
            String.raw`{"@context":"http://schema.org","@type":"WebPage","breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"https://hikka.io/anime","url":"https://hikka.io/anime","name":"Аніме"}},{"@type":"ListItem","position":2,"item":{"@id":"https://hikka.io/anime/akira-8e242d","url":"https://hikka.io/anime/akira-8e242d","name":"Акіра \u003cb>","image":"https://cdn.hikka.io/content/anime/akira.jpg"}}]},"mainEntity":{"@type":"TVSeries","name":"Акіра \u003cb>","alternateName":["Akira 1988","アキラ"],"image":"https://cdn.hikka.io/content/anime/akira.jpg","description":"Минув 31 рік після війни.\r\nНео-Токіо & \u003c/script> &quot;лапки&quot;\r\n","startDate":584150400,"endDate":584150400,"genre":["Екшн","Фантастика"],"keywords":["Akira 1988","アキラ"],"countryOfOrigin":"JP","aggregateRating":{"@type":"AggregateRating","ratingValue":8.1,"ratingCount":12345,"bestRating":10,"worstRating":1},"numberOfEpisodes":1,"musicBy":null,"timeRequired":"PT24M"}}`,
        );
    });

    it('falls back to the original title and drops an empty rating', () => {
        expect(
            serializeJsonLd(
                contentJsonLd({
                    content: UNTITLED_ANIME,
                    contentType: 'anime',
                }),
            ),
        ).toBe(
            '{"@context":"http://schema.org","@type":"WebPage","breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"https://hikka.io/anime","url":"https://hikka.io/anime","name":"Аніме"}},{"@type":"ListItem","position":2,"item":{"@id":"https://hikka.io/anime/no-title-abc123","url":"https://hikka.io/anime/no-title-abc123","name":"タイトル","image":null}}]},"mainEntity":{"@type":"TVSeries","name":"タイトル","alternateName":[],"image":null,"description":"","startDate":null,"endDate":null,"genre":[],"keywords":[],"countryOfOrigin":"JP","numberOfEpisodes":null,"musicBy":null,"timeRequired":"PT24M"}}',
        );
    });

    it('drops the rating of a manga nobody scored', () => {
        expect(
            serializeJsonLd(
                contentJsonLd({ content: MANGA, contentType: 'manga' }),
            ),
        ).toBe(
            String.raw`{"@context":"http://schema.org","@type":"WebPage","breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"https://hikka.io/manga","url":"https://hikka.io/manga","name":"Манґа"}},{"@type":"ListItem","position":2,"item":{"@id":"https://hikka.io/manga/berserk-fb9fbd","url":"https://hikka.io/manga/berserk-fb9fbd","name":"Berserk","image":"https://cdn.hikka.io/content/manga/berserk.jpg"}}]},"mainEntity":{"@type":"Book","name":"Berserk","alternateName":["Берсерк"],"image":"https://cdn.hikka.io/content/manga/berserk.jpg","description":"Guts, a former mercenary.\r\n","startDate":619315200,"endDate":null,"genre":["Фентезі"],"keywords":["Берсерк"],"countryOfOrigin":"JP","numberOfPages":380}}`,
        );
    });

    it('serializes a novel with a markdown synopsis', () => {
        expect(
            serializeJsonLd(
                contentJsonLd({ content: NOVEL, contentType: 'novel' }),
            ),
        ).toBe(
            String.raw`{"@context":"http://schema.org","@type":"WebPage","breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"https://hikka.io/novel","url":"https://hikka.io/novel","name":"Ранобе"}},{"@type":"ListItem","position":2,"item":{"@id":"https://hikka.io/novel/omniscient-readers-viewpoint-03471e","url":"https://hikka.io/novel/omniscient-readers-viewpoint-03471e","name":"전지적 독자 시점","image":"https://cdn.hikka.io/content/novel/orv.jpg"}}]},"mainEntity":{"@type":"Book","name":"전지적 독자 시점","alternateName":["ORV"],"image":"https://cdn.hikka.io/content/novel/orv.jpg","description":"1 ) Заголовок\u003cul>\n\u003cli>пункт один\u003c/li>\n\u003cli>пункт два\u003c/li>\n\u003c/ul>\n","startDate":1517443200,"endDate":1580515200,"genre":["Екшн","Драма"],"keywords":["ORV"],"countryOfOrigin":"JP","aggregateRating":{"@type":"AggregateRating","ratingValue":8.9,"ratingCount":4321,"bestRating":10,"worstRating":1},"numberOfPages":null}}`,
        );
    });
});
