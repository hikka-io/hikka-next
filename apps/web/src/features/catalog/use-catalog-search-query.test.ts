import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    type MainContentTypeEnum,
} from '@hikka/api';

import {
    animeSearchSchema,
    mangaSearchSchema,
    novelSearchSchema,
} from '@/utils/search-schemas';

import CatalogList from './catalog-list';
import CatalogListSummary from './catalog-list-summary';
import {
    buildAnimeSearchArgs,
    buildMangaSearchArgs,
    buildNovelSearchArgs,
} from './search-args';
import { useCatalogSearchQuery } from './use-catalog-search-query';

const mocks = vi.hoisted(() => ({
    search: {} as Record<string, unknown>,
    infiniteListCalls: [] as unknown[][],
    viewProps: [] as Record<string, unknown>[],
    summaryProps: [] as Record<string, unknown>[],
    viewKeys: [] as unknown[],
    view: 'grid',
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useRouteSearch: () => mocks.search,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.infiniteListCalls.push(args);
        return { list: undefined };
    },
}));

vi.mock('@/features/auth/hooks/use-session-ui', () => ({
    useSessionUI: () => ({
        preferences: { title_language: 'title_en', name_language: 'name_en' },
    }),
}));

vi.mock('./catalog-list-view', () => ({
    default: (props: Record<string, unknown>) => {
        mocks.viewProps.push(props);
        return null;
    },
}));

vi.mock('./catalog-summary', () => ({
    default: (props: Record<string, unknown>) => {
        mocks.summaryProps.push(props);
        return null;
    },
}));

vi.mock('./use-catalog-view', () => ({
    useCatalogView: (key: unknown) => {
        mocks.viewKeys.push(key);
        return { view: mocks.view, setView: () => {} };
    },
}));

type Case = { type: MainContentTypeEnum; name: string; raw: object };

const SHARED_CASES: [string, object][] = [
    ['empty', {}],
    [
        'statuses, types and years',
        {
            statuses: ['ongoing'],
            types: ['tv', 'manga'],
            years: ['2010', '2020'],
        },
    ],
    ['score', { score: ['7', '10'] }],
    ['empty score', { score: [] }],
    ['sort and order', { sort: 'start_date', order: 'asc' }],
    ['sort with secondary fields', { sort: 'native_score' }],
    ['page 2', { page: '2' }],
    ['only translated', { only_translated: 'true' }],
    ['genres', { genres: ['action', '-ecchi'] }],
    ['search text', { search: 'naruto' }],
    ['empty search text', { search: '' }],
];

const ANIME_CASES: [string, object][] = [
    ...SHARED_CASES,
    [
        'studios, ratings and seasons',
        {
            studios: 'mappa',
            ratings: ['pg_13', 'r'],
            seasons: ['fall', 'winter'],
        },
    ],
    ['date range', { date_range: ['-2', '1'], years: ['2000', '2005'] }],
    ['single date range value', { date_range: ['3'], years: ['2000', '2005'] }],
    [
        'every filter',
        {
            statuses: ['ongoing', 'finished'],
            types: ['tv'],
            years: ['1990', '2000'],
            seasons: ['spring'],
            ratings: ['r_plus'],
            studios: ['sunrise', 'bones'],
            genres: ['romance'],
            score: ['5', '9'],
            only_translated: 'true',
            sort: 'score',
            order: 'asc',
            search: 'gundam',
            page: '3',
        },
    ],
];

const READ_CASES: [string, object][] = [
    ...SHARED_CASES,
    [
        'anime-only params',
        {
            seasons: ['fall'],
            ratings: ['pg_13'],
            studios: 'mappa',
            date_range: ['-2', '1'],
        },
    ],
    [
        'every filter',
        {
            statuses: ['ongoing', 'finished'],
            types: ['manga', 'light_novel'],
            years: ['1990', '2000'],
            genres: ['romance'],
            score: ['5', '9'],
            only_translated: 'true',
            sort: 'media_type',
            order: 'asc',
            search: 'berserk',
            page: '3',
        },
    ],
];

const CASES: Case[] = [
    ...ANIME_CASES.map(([name, raw]) => ({
        type: ContentTypeEnum.ANIME,
        name,
        raw,
    })),
    ...READ_CASES.map(([name, raw]) => ({
        type: ContentTypeEnum.MANGA,
        name,
        raw,
    })),
    ...READ_CASES.map(([name, raw]) => ({
        type: ContentTypeEnum.NOVEL,
        name,
        raw,
    })),
];

const HOOK_CASES = CASES.flatMap((testCase) =>
    [undefined, 28].map((size) => ({ ...testCase, size })),
);

const COMPONENT_CASES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
].flatMap((type) => [
    { type, view: 'grid', props: { extendedSize: 7, pageSize: 28 } },
    { type, view: 'list', props: { extendedSize: 1 } },
    { type, view: 'grid', props: {} },
]);

const ITEMS: Record<MainContentTypeEnum, object> = {
    anime: {
        slug: 'anime-slug',
        data_type: 'anime',
        title_ua: 'Аніме',
        title_en: 'Anime EN',
        title_ja: 'Anime JA',
    },
    manga: {
        slug: 'manga-slug',
        data_type: 'manga',
        title_ua: 'Манґа',
        title_en: null,
        title_original: 'Manga Original',
    },
    novel: {
        slug: 'novel-slug',
        data_type: 'novel',
        title_ua: 'Ранобе',
        title_en: 'Novel EN',
        title_original: 'Novel Original',
    },
};

const EXPECTED_ARGS: Record<string, string> = {
    'anime | empty':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | statuses, types and years':
        '{"args":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"season":[],"rating":[],"years":[2010,2020],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | empty score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | sort and order':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"page":1}',
    'anime | sort with secondary fields':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"page":1}',
    'anime | page 2':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":2}',
    'anime | only translated':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | genres':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":["action","-ecchi"],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | search text':
        '{"args":{"query":"naruto","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | empty search text':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | studios, ratings and seasons':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":["fall","winter"],"rating":["pg_13","r"],"years":[],"genres":[],"studios":["mappa"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | date range':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[["winter",2026],["fall",2026]],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | single date range value':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[2000,2005],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'anime | every filter':
        '{"args":{"query":"gundam","media_type":["tv"],"status":["ongoing","finished"],"season":["spring"],"rating":["r_plus"],"years":[1990,2000],"genres":["romance"],"studios":["sunrise","bones"],"score":[5,9],"only_translated":true,"sort":["score:asc","scored_by:asc"]},"page":3}',
    'manga | empty':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | statuses, types and years':
        '{"args":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | empty score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | sort and order':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"page":1}',
    'manga | sort with secondary fields':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"page":1}',
    'manga | page 2':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":2}',
    'manga | only translated':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | genres':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | search text':
        '{"args":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | empty search text':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | anime-only params':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'manga | every filter':
        '{"args":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"page":3}',
    'novel | empty':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | statuses, types and years':
        '{"args":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | empty score':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | sort and order':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"page":1}',
    'novel | sort with secondary fields':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"page":1}',
    'novel | page 2':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":2}',
    'novel | only translated':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | genres':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | search text':
        '{"args":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | empty search text':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | anime-only params':
        '{"args":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"page":1}',
    'novel | every filter':
        '{"args":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"page":3}',
};

const EXPECTED_KEYS: Record<string, string> = {
    'anime | empty | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | empty | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | statuses, types and years | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"season":[],"rating":[],"years":[2010,2020],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | statuses, types and years | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"season":[],"rating":[],"years":[2010,2020],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | score | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | score | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | empty score | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | empty score | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | sort and order | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | sort and order | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":28,"page":1}}]',
    'anime | sort with secondary fields | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | sort with secondary fields | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | page 2 | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
    'anime | page 2 | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
    'anime | only translated | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | only translated | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | genres | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":["action","-ecchi"],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | genres | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":["action","-ecchi"],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | search text | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | search text | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | empty search text | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | empty search text | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | studios, ratings and seasons | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":["fall","winter"],"rating":["pg_13","r"],"years":[],"genres":[],"studios":["mappa"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | studios, ratings and seasons | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":["fall","winter"],"rating":["pg_13","r"],"years":[],"genres":[],"studios":["mappa"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | date range | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[["winter",2026],["fall",2026]],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | date range | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[["winter",2026],["fall",2026]],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | single date range value | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[2000,2005],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'anime | single date range value | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"season":[],"rating":[],"years":[2000,2005],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'anime | every filter | undefined':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"gundam","media_type":["tv"],"status":["ongoing","finished"],"season":["spring"],"rating":["r_plus"],"years":[1990,2000],"genres":["romance"],"studios":["sunrise","bones"],"score":[5,9],"only_translated":true,"sort":["score:asc","scored_by:asc"]},"query":{"size":"<undefined>","page":3}}]',
    'anime | every filter | 28':
        '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"gundam","media_type":["tv"],"status":["ongoing","finished"],"season":["spring"],"rating":["r_plus"],"years":[1990,2000],"genres":["romance"],"studios":["sunrise","bones"],"score":[5,9],"only_translated":true,"sort":["score:asc","scored_by:asc"]},"query":{"size":28,"page":3}}]',
    'manga | empty | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | empty | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | statuses, types and years | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | statuses, types and years | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | score | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | score | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | empty score | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | empty score | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | sort and order | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | sort and order | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":28,"page":1}}]',
    'manga | sort with secondary fields | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | sort with secondary fields | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | page 2 | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
    'manga | page 2 | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
    'manga | only translated | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | only translated | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | genres | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | genres | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | search text | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | search text | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | empty search text | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | empty search text | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | anime-only params | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'manga | anime-only params | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'manga | every filter | undefined':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"query":{"size":"<undefined>","page":3}}]',
    'manga | every filter | 28':
        '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"query":{"size":28,"page":3}}]',
    'novel | empty | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | empty | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | statuses, types and years | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | statuses, types and years | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":["tv","manga"],"status":["ongoing"],"years":[2010,2020],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | score | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | score | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":[7,10],"only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | empty score | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | empty score | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | sort and order | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | sort and order | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["start_date:asc"]},"query":{"size":28,"page":1}}]',
    'novel | sort with secondary fields | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | sort with secondary fields | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["native_score:desc","native_scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | page 2 | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
    'novel | page 2 | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
    'novel | only translated | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | only translated | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":true,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | genres | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | genres | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":["action","-ecchi"],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | search text | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | search text | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"naruto","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | empty search text | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | empty search text | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | anime-only params | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":1}}]',
    'novel | anime-only params | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":[],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":1}}]',
    'novel | every filter | undefined':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"query":{"size":"<undefined>","page":3}}]',
    'novel | every filter | 28':
        '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"berserk","media_type":["manga","light_novel"],"status":["ongoing","finished"],"years":[1990,2000],"genres":["romance"],"score":[5,9],"only_translated":true,"sort":["media_type:asc"]},"query":{"size":28,"page":3}}]',
};

const EXPECTED_COMPONENTS: Record<
    string,
    {
        queryKey: string;
        viewProps: string;
        grid: string;
        list: string;
        summary: string;
    }
> = {
    'anime | grid | {"extendedSize":7,"pageSize":28}': {
        queryKey:
            '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":7}',
        grid: 'AnimeCard key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"}}',
        list: 'CatalogListItem key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"},"title":"Anime EN","type":"anime"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'anime | list | {"extendedSize":1}': {
        queryKey:
            '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"list","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":1}',
        grid: 'AnimeCard key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"}}',
        list: 'CatalogListItem key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"},"title":"Anime EN","type":"anime"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'anime | grid | {}': {
        queryKey:
            '[{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":5}',
        grid: 'AnimeCard key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"}}',
        list: 'CatalogListItem key=anime-slug {"item":{"slug":"anime-slug","data_type":"anime","title_ua":"Аніме","title_en":"Anime EN","title_ja":"Anime JA"},"title":"Anime EN","type":"anime"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'manga | grid | {"extendedSize":7,"pageSize":28}': {
        queryKey:
            '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":7}',
        grid: 'MangaCard key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"}}',
        list: 'CatalogListItem key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"},"title":"Манґа","type":"manga"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'manga | list | {"extendedSize":1}': {
        queryKey:
            '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"list","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":1}',
        grid: 'MangaCard key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"}}',
        list: 'CatalogListItem key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"},"title":"Манґа","type":"manga"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'manga | grid | {}': {
        queryKey:
            '[{"_id":"searchManga","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":5}',
        grid: 'MangaCard key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"}}',
        list: 'CatalogListItem key=manga-slug {"item":{"slug":"manga-slug","data_type":"manga","title_ua":"Манґа","title_en":null,"title_original":"Manga Original"},"title":"Манґа","type":"manga"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'novel | grid | {"extendedSize":7,"pageSize":28}': {
        queryKey:
            '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":28,"page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":7}',
        grid: 'NovelCard key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"}}',
        list: 'CatalogListItem key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"},"title":"Novel EN","type":"novel"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'novel | list | {"extendedSize":1}': {
        queryKey:
            '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"list","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":1}',
        grid: 'NovelCard key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"}}',
        list: 'CatalogListItem key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"},"title":"Novel EN","type":"novel"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
    'novel | grid | {}': {
        queryKey:
            '[{"_id":"searchNovel","baseUrl":"https://api.example.test","_infinite":true,"body":{"query":"<undefined>","media_type":[],"status":["ongoing"],"years":[],"genres":[],"score":"<undefined>","only_translated":false,"sort":["score:desc","scored_by:desc"]},"query":{"size":"<undefined>","page":2}}]',
        viewProps:
            '{"list":"<undefined>","view":"grid","isLoading":"<undefined>","isFetchingNextPage":"<undefined>","hasNextPage":"<undefined>","fetchNextPage":"<undefined>","hasMultiplePages":false,"pagination":"<undefined>","extendedSize":5}',
        grid: 'NovelCard key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"}}',
        list: 'CatalogListItem key=novel-slug {"item":{"slug":"novel-slug","data_type":"novel","title_ua":"Ранобе","title_en":"Novel EN","title_original":"Novel Original"},"title":"Novel EN","type":"novel"}',
        summary: '[{"total":"<undefined>","isLoading":"<undefined>"}]',
    },
};

function serialize(value: unknown) {
    return JSON.stringify(value, (_, inner) =>
        inner === undefined ? '<undefined>' : inner,
    );
}

function parseSearch(type: MainContentTypeEnum, raw: object) {
    switch (type) {
        case ContentTypeEnum.ANIME:
            return animeSearchSchema.parse(raw);
        case ContentTypeEnum.MANGA:
            return mangaSearchSchema.parse(raw);
        case ContentTypeEnum.NOVEL:
            return novelSearchSchema.parse(raw);
    }
}

function buildArgs(type: MainContentTypeEnum, raw: object) {
    switch (type) {
        case ContentTypeEnum.ANIME:
            return buildAnimeSearchArgs(animeSearchSchema.parse(raw));
        case ContentTypeEnum.MANGA:
            return buildMangaSearchArgs(mangaSearchSchema.parse(raw));
        case ContentTypeEnum.NOVEL:
            return buildNovelSearchArgs(novelSearchSchema.parse(raw));
    }
}

function describeElement(element: ReactElement) {
    const type = element.type as { name: string };
    return `${type.name} key=${element.key} ${serialize(element.props)}`;
}

beforeAll(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-29T12:00:00Z'));
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

beforeEach(() => {
    mocks.search = {};
    mocks.infiniteListCalls = [];
    mocks.viewProps = [];
    mocks.summaryProps = [];
    mocks.viewKeys = [];
    mocks.view = 'grid';
});

describe('catalog search args builders', () => {
    it.each(CASES)('$type: $name', ({ type, name, raw }) => {
        expect(serialize(buildArgs(type, raw))).toBe(
            EXPECTED_ARGS[`${type} | ${name}`],
        );
    });
});

describe('useCatalogSearchQuery', () => {
    it.each(HOOK_CASES)('$type: $name, size $size', ({
        type,
        name,
        raw,
        size,
    }) => {
        const search = parseSearch(type, raw);
        mocks.search = search;

        const result = useCatalogSearchQuery(type, size);

        expect(mocks.infiniteListCalls).toHaveLength(1);
        const [call] = mocks.infiniteListCalls;
        expect(call).toHaveLength(1);
        const options = call[0] as Record<string, unknown>;
        expect(Object.keys(options)).toEqual([
            'queryFn',
            'queryKey',
            'initialPageParam',
            'getNextPageParam',
        ]);
        expect(options.queryFn).toBeTypeOf('function');
        expect(options.getNextPageParam).toBeTypeOf('function');
        expect(serialize(options.queryKey)).toBe(
            EXPECTED_KEYS[`${type} | ${name} | ${size}`],
        );
        expect(
            serialize({ args: result.args, page: options.initialPageParam }),
        ).toBe(EXPECTED_ARGS[`${type} | ${name}`]);
        expect(Object.keys(result)).toEqual([
            'list',
            'queryKey',
            'args',
            'search',
        ]);
        expect(result.queryKey).toBe(options.queryKey);
        expect(result.search).toBe(search);
    });
});

describe('CatalogList and CatalogListSummary', () => {
    it.each(COMPONENT_CASES)('$type: $view, $props', ({
        type,
        view,
        props,
    }) => {
        const expected =
            EXPECTED_COMPONENTS[`${type} | ${view} | ${serialize(props)}`];
        const listProps = props as { extendedSize?: 1 | 7; pageSize?: number };
        mocks.search = parseSearch(type, { statuses: ['ongoing'], page: '2' });
        mocks.view = view;

        renderToStaticMarkup(
            createElement(CatalogList, { contentType: type, ...listProps }),
        );
        renderToStaticMarkup(
            createElement(CatalogListSummary, {
                contentType: type,
                pageSize: listProps.pageSize,
            }),
        );

        expect(mocks.infiniteListCalls).toHaveLength(2);
        const [[listOptions], [summaryOptions]] = mocks.infiniteListCalls as [
            [{ queryKey: unknown }],
            [{ queryKey: unknown }],
        ];
        expect(serialize(listOptions.queryKey)).toBe(expected.queryKey);
        expect(serialize(summaryOptions.queryKey)).toBe(expected.queryKey);
        expect(mocks.viewKeys).toEqual(['catalog']);

        expect(mocks.viewProps).toHaveLength(1);
        const [viewProps] = mocks.viewProps;
        expect(Object.keys(viewProps)).toEqual([
            'list',
            'view',
            'isLoading',
            'isFetchingNextPage',
            'hasNextPage',
            'fetchNextPage',
            'hasMultiplePages',
            'pagination',
            'removeQueryKey',
            'extendedSize',
            'renderGridItem',
            'renderListItem',
        ]);
        expect(viewProps.removeQueryKey).toBe(listOptions.queryKey);
        const { renderGridItem, renderListItem } = viewProps as {
            renderGridItem: (item: unknown) => ReactElement;
            renderListItem: (item: unknown) => ReactElement;
        };
        const dataProps = Object.fromEntries(
            Object.entries(viewProps).filter(
                ([key]) =>
                    ![
                        'removeQueryKey',
                        'renderGridItem',
                        'renderListItem',
                    ].includes(key),
            ),
        );
        expect(serialize(dataProps)).toBe(expected.viewProps);
        expect(describeElement(renderGridItem(ITEMS[type]))).toBe(
            expected.grid,
        );
        expect(describeElement(renderListItem(ITEMS[type]))).toBe(
            expected.list,
        );
        expect(serialize(mocks.summaryProps)).toBe(expected.summary);
    });
});
