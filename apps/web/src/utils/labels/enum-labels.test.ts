import { describe, expect, it } from 'vitest';

import { AnimeMediaEnum, MangaMediaEnum, NovelMediaEnum } from '@hikka/api';

import {
    AGE_RATING,
    ANIME_MEDIA_TYPE,
    ARTICLE_CATEGORY,
    EDIT_STATUS,
    GENRE_TYPES,
    getMediaTypeLabel,
    LIST_STATUS,
    MANGA_MEDIA_TYPE,
    MEDIA_TYPE,
    MEDIA_TYPE_BY_CONTENT_TYPE,
    NOVEL_MEDIA_TYPE,
    READ_STATUS,
    RELEASE_STATUS,
    SEASON,
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
