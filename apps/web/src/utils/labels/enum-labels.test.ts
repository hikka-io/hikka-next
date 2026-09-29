import { describe, expect, it } from 'vitest';

import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeOstTypeEnum,
    AnimeVideoTypeEnum,
    ArticleCategoryEnum,
    ContentStatusEnum,
    EditStatusEnum,
    GenreTypeEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadStatusEnum,
    SeasonEnum,
    WatchStatusEnum,
} from '@hikka/api';

import {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    ARTICLE_CATEGORY,
    CHARACTER_ISSUES,
    CONTENT_ISSUES,
    EDIT_STATUS,
    GENRE_TYPES,
    getMediaTypeLabel,
    LIST_STATUS,
    MANGA_MEDIA_TYPE,
    MEDIA_TYPE,
    MEDIA_TYPE_BY_CONTENT_TYPE,
    NOVEL_MEDIA_TYPE,
    OST,
    PERSON_ISSUES,
    READ_STATUS,
    RELEASE_STATUS,
    SEASON,
    VIDEO,
    WATCH_STATUS,
} from './enum-labels';

type Dictionary = Record<string, { title_ua: string }>;

const labels = (dictionary: Dictionary) =>
    Object.entries(dictionary).map(([key, { title_ua }]) => [key, title_ua]);

const EXPECTED: [string, Dictionary, string[][]][] = [
    [
        'SEASON',
        SEASON,
        [
            ['winter', 'Зима'],
            ['spring', 'Весна'],
            ['summer', 'Літо'],
            ['fall', 'Осінь'],
        ],
    ],
    [
        'RELEASE_STATUS',
        RELEASE_STATUS,
        [
            ['discontinued', 'Припинено'],
            ['ongoing', 'Онґоїнґ'],
            ['finished', 'Завершено'],
            ['announced', 'Анонс'],
            ['paused', 'Призупинено'],
        ],
    ],
    [
        'ANIME_MEDIA_TYPE',
        ANIME_MEDIA_TYPE,
        [
            ['special', 'Спешл'],
            ['movie', 'Фільм'],
            ['ova', 'OVA'],
            ['ona', 'ONA'],
            ['tv', 'TV Серіал'],
            ['music', 'Музика'],
        ],
    ],
    [
        'MANGA_MEDIA_TYPE',
        MANGA_MEDIA_TYPE,
        [
            ['one_shot', 'Ваншот'],
            ['doujin', 'Доджінші'],
            ['manhua', 'Маньхва'],
            ['manhwa', 'Манхва'],
            ['manga', 'Манґа'],
        ],
    ],
    [
        'NOVEL_MEDIA_TYPE',
        NOVEL_MEDIA_TYPE,
        [
            ['light_novel', 'Ранобе'],
            ['novel', 'Вебновела'],
        ],
    ],
    [
        'AGE_RATING',
        AGE_RATING,
        [
            ['g', 'G'],
            ['pg', 'PG'],
            ['pg_13', 'PG-13'],
            ['r', 'R'],
            ['r_plus', 'R PLUS'],
            ['rx', 'RX'],
        ],
    ],
    [
        'GENRE_TYPES',
        GENRE_TYPES,
        [
            ['theme', 'Тематичне'],
            ['explicit', 'Для дорослих'],
            ['genre', 'Основне'],
            ['demographic', 'Демографічне'],
        ],
    ],
    [
        'READ_STATUS',
        READ_STATUS,
        [
            ['planned', 'Заплановано'],
            ['completed', 'Завершено'],
            ['on_hold', 'Відкладено'],
            ['dropped', 'Закинуто'],
            ['reading', 'Читаю'],
        ],
    ],
    [
        'WATCH_STATUS',
        WATCH_STATUS,
        [
            ['planned', 'Заплановано'],
            ['watching', 'Дивлюсь'],
            ['completed', 'Завершено'],
            ['on_hold', 'Відкладено'],
            ['dropped', 'Закинуто'],
        ],
    ],
    [
        'ARTICLE_CATEGORY',
        ARTICLE_CATEGORY,
        [
            ['news', 'Новини'],
            ['system', 'Системне'],
            ['reviews', 'Огляди'],
            ['original', 'Авторське'],
        ],
    ],
    [
        'EDIT_STATUS',
        EDIT_STATUS,
        [
            ['pending', 'На Розгляді'],
            ['accepted', 'Прийнято'],
            ['denied', 'Відхилено'],
            ['closed', 'Закрито'],
        ],
    ],
];

describe('enum labels', () => {
    it.each(
        EXPECTED,
    )('%s keeps its option order and labels', (_, dictionary, expected) => {
        expect(labels(dictionary)).toEqual(expected);
    });

    it('merges every media type in anime, manga, novel order', () => {
        expect(Object.keys(MEDIA_TYPE)).toEqual([
            ...Object.keys(ANIME_MEDIA_TYPE),
            ...Object.keys(MANGA_MEDIA_TYPE),
            ...Object.keys(NOVEL_MEDIA_TYPE),
        ]);
    });

    it('keeps the system article category admin-only', () => {
        expect(
            Object.entries(ARTICLE_CATEGORY)
                .filter(([, category]) => category.admin)
                .map(([key]) => key),
        ).toEqual(['system']);
    });
});

describe('getMediaTypeLabel', () => {
    it.each([
        [
            'anime',
            AnimeMediaEnum,
            [
                ['special', 'Спешл'],
                ['movie', 'Фільм'],
                ['music', 'Музика'],
                ['ova', 'OVA'],
                ['ona', 'ONA'],
                ['tv', 'TV Серіал'],
            ],
        ],
        [
            'manga',
            MangaMediaEnum,
            [
                ['one_shot', 'Ваншот'],
                ['doujin', 'Доджінші'],
                ['manhua', 'Маньхва'],
                ['manhwa', 'Манхва'],
                ['manga', 'Манґа'],
            ],
        ],
        [
            'novel',
            NovelMediaEnum,
            [
                ['light_novel', 'Ранобе'],
                ['novel', 'Вебновела'],
            ],
        ],
    ])('labels every %s media type', (_, mediaEnum, expected) => {
        expect(
            Object.values(mediaEnum).map((value) => [
                value,
                getMediaTypeLabel(value),
            ]),
        ).toEqual(expected);
    });

    it('keeps the anime, manga and novel media types disjoint', () => {
        const values = [
            ...Object.values(AnimeMediaEnum),
            ...Object.values(MangaMediaEnum),
            ...Object.values(NovelMediaEnum),
        ];

        expect(new Set(values).size).toBe(values.length);
    });

    it.each([
        undefined,
        null,
        '',
        'unknown',
        'constructor',
    ])('returns undefined for %j', (value) => {
        expect(getMediaTypeLabel(value)).toBeUndefined();
    });
});

describe('MEDIA_TYPE_BY_CONTENT_TYPE', () => {
    it('maps only anime, manga and novel to their dictionaries', () => {
        expect(Object.keys(MEDIA_TYPE_BY_CONTENT_TYPE)).toEqual([
            'anime',
            'manga',
            'novel',
        ]);
        expect(MEDIA_TYPE_BY_CONTENT_TYPE.anime).toBe(ANIME_MEDIA_TYPE);
        expect(MEDIA_TYPE_BY_CONTENT_TYPE.manga).toBe(MANGA_MEDIA_TYPE);
        expect(MEDIA_TYPE_BY_CONTENT_TYPE.novel).toBe(NOVEL_MEDIA_TYPE);
    });
});

describe('LIST_STATUS', () => {
    it('picks the watch and read dictionaries by kind', () => {
        expect(LIST_STATUS.watch).toBe(WATCH_STATUS);
        expect(LIST_STATUS.read).toBe(READ_STATUS);
    });

    it('lets read win the shared keys when merged after watch', () => {
        const merged = { ...LIST_STATUS.watch, ...LIST_STATUS.read };

        expect(labels(merged)).toEqual([
            ['planned', 'Заплановано'],
            ['watching', 'Дивлюсь'],
            ['completed', 'Завершено'],
            ['on_hold', 'Відкладено'],
            ['dropped', 'Закинуто'],
            ['reading', 'Читаю'],
        ]);
        expect(merged.on_hold).toBe(READ_STATUS.on_hold);
        expect(merged.planned).toBe(READ_STATUS.planned);
        expect(merged.completed).toBe(READ_STATUS.completed);
        expect(merged.dropped).toBe(READ_STATUS.dropped);
        expect(merged.watching).toBe(WATCH_STATUS.watching);
    });
});

describe('enum label coverage', () => {
    it.each([
        ['SEASON', SEASON, SeasonEnum],
        ['RELEASE_STATUS', RELEASE_STATUS, ContentStatusEnum],
        ['ANIME_MEDIA_TYPE', ANIME_MEDIA_TYPE, AnimeMediaEnum],
        ['MANGA_MEDIA_TYPE', MANGA_MEDIA_TYPE, MangaMediaEnum],
        ['NOVEL_MEDIA_TYPE', NOVEL_MEDIA_TYPE, NovelMediaEnum],
        ['AGE_RATING', AGE_RATING, AnimeAgeRatingEnum],
        ['VIDEO', VIDEO, AnimeVideoTypeEnum],
        ['OST', OST, AnimeOstTypeEnum],
        ['GENRE_TYPES', GENRE_TYPES, GenreTypeEnum],
        ['READ_STATUS', READ_STATUS, ReadStatusEnum],
        ['WATCH_STATUS', WATCH_STATUS, WatchStatusEnum],
        ['ARTICLE_CATEGORY', ARTICLE_CATEGORY, ArticleCategoryEnum],
        ['EDIT_STATUS', EDIT_STATUS, EditStatusEnum],
    ] as [
        string,
        Dictionary,
        Record<string, string>,
    ][])('%s has a Ukrainian title for every enum value', (_, dictionary, values) => {
        for (const value of Object.values(values)) {
            expect(dictionary[value]?.title_ua).toEqual(expect.any(String));
            expect(dictionary[value].title_ua).not.toBe('');
        }
    });
});

describe('English titles', () => {
    it.each([
        ['SEASON', SEASON],
        ['RELEASE_STATUS', RELEASE_STATUS],
        ['MEDIA_TYPE', MEDIA_TYPE],
        ['AGE_RATING', AGE_RATING],
        ['GENRE_TYPES', GENRE_TYPES],
        ['ARTICLE_CATEGORY', ARTICLE_CATEGORY],
        ['CONTENT_ISSUES', CONTENT_ISSUES],
        ['PERSON_ISSUES', PERSON_ISSUES],
        ['CHARACTER_ISSUES', CHARACTER_ISSUES],
        ['EDIT_STATUS', EDIT_STATUS],
    ] as [
        string,
        Dictionary,
    ][])('%s carries no English title', (_, dictionary) => {
        for (const entry of Object.values(dictionary)) {
            expect(entry).not.toHaveProperty('title_en');
            expect(entry.title_ua).toEqual(expect.any(String));
        }
    });

    it.each([
        ['VIDEO', VIDEO],
        ['OST', OST],
        ['READ_STATUS', READ_STATUS],
        ['WATCH_STATUS', WATCH_STATUS],
    ] as [
        string,
        Record<string, { title_en: string }>,
    ][])('%s keeps the English fallback title', (_, dictionary) => {
        for (const entry of Object.values(dictionary)) {
            expect(entry.title_en).toEqual(expect.any(String));
            expect(entry.title_en).not.toBe('');
        }
    });

    it('keeps the issue keys the todo filters send', () => {
        expect(Object.keys(CONTENT_ISSUES)).toEqual([
            'title_ua',
            'title_en',
            'title_original',
            'synopsis_ua',
            'synopsis_en',
        ]);
        expect(Object.keys(CHARACTER_ISSUES)).toEqual([
            'name_ua',
            'name_en',
            'name_original',
            'description_ua',
        ]);
    });
});
