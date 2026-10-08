import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { HikkaApiError } from './errors';
import { getCollection } from './gen/sdk.gen';
import {
    zAnimeResponseWithWatch,
    zCharacterResponse,
    zCollectionContentResponse,
    zMangaResponseWithRead,
    zNovelResponseWithRead,
    zPersonResponse,
} from './gen/zod.gen';
import { createRequestClient } from './transport';

const TITLED = {
    start_date: null,
    end_date: null,
    created: 1700000000,
    updated: 1700000000,
    media_type: 'tv',
    title_ua: 'Назва',
    title_en: 'Title',
    status: 'finished',
    image: null,
    year: 2020,
    native_scored_by: 10,
    native_score: 7.5,
    scored_by: 3,
    score: 8,
    mal_id: 1,
    translated_ua: true,
    genres: [],
    synopsis_en: null,
    synopsis_ua: null,
};

const PRINTED = {
    ...TITLED,
    title_original: 'Original',
    chapters: 10,
    volumes: 2,
    magazines: [],
    read: [],
};

const VARIANTS = {
    anime: {
        ...TITLED,
        data_type: 'anime',
        slug: 'anime-slug',
        title_ja: null,
        episodes_released: 12,
        episodes_total: 12,
        season: 'spring',
        source: 'manga',
        rating: 'pg_13',
        studios: [],
        watch: [],
    },
    manga: { ...PRINTED, data_type: 'manga', slug: 'manga-slug' },
    novel: { ...PRINTED, data_type: 'novel', slug: 'novel-slug' },
    character: {
        data_type: 'character',
        name_ua: 'Імʼя',
        name_en: 'Name',
        name_ja: null,
        image: null,
        slug: 'character-slug',
        synonyms: [],
    },
    person: {
        data_type: 'person',
        name_native: null,
        name_ua: 'Імʼя',
        name_en: 'Name',
        image: null,
        slug: 'person-slug',
        description_ua: null,
        synonyms: [],
    },
};

const entry = (content: unknown) => ({
    comment: null,
    label: 'Група',
    content_type: 'anime',
    order: 1,
    content,
});

const PLAIN_UNION = z.union([
    zAnimeResponseWithWatch,
    zMangaResponseWithRead,
    zNovelResponseWithRead,
    zCharacterResponse,
    zPersonResponse,
]);

const REJECTED = {
    'missing data_type': (() => {
        const { data_type: _, ...rest } = VARIANTS.anime;
        return rest;
    })(),
    'unknown data_type': { ...VARIANTS.character, data_type: 'comment' },
    'data_type of another shape': { ...VARIANTS.character, data_type: 'anime' },
    'a variant missing a field': (() => {
        const { slug: _, ...rest } = VARIANTS.manga;
        return rest;
    })(),
    'null content': null,
};

describe('collection content validation', () => {
    it.each(Object.entries(VARIANTS))(
        'accepts the %s variant',
        (_, content) => {
            const parsed = zCollectionContentResponse.parse(entry(content));

            expect(parsed.content).toEqual(content);
            expect(PLAIN_UNION.parse(content)).toEqual(parsed.content);
        },
    );

    it('strips unknown keys like the plain union', () => {
        const content = { ...VARIANTS.person, extra: true };
        const parsed = zCollectionContentResponse.parse(entry(content));

        expect(parsed.content).toEqual(VARIANTS.person);
        expect(PLAIN_UNION.parse(content)).toEqual(VARIANTS.person);
    });

    it.each(Object.entries(REJECTED))('rejects %s', (_, content) => {
        expect(
            zCollectionContentResponse.safeParse(entry(content)).success,
        ).toBe(false);
        expect(PLAIN_UNION.safeParse(content).success).toBe(false);
    });
});

describe('sdk response validation', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const respond = (body: unknown) =>
        vi.stubGlobal(
            'fetch',
            vi.fn(
                async () =>
                    new Response(JSON.stringify(body), {
                        status: 200,
                        headers: { 'content-type': 'application/json' },
                    }),
            ),
        );

    const collection = (content: unknown[]) => ({
        data_type: 'collection',
        visibility: 'public',
        author: {
            reference: 'user',
            updated: null,
            created: 1700000000,
            description: null,
            username: 'user',
            cover: null,
            active: true,
            avatar: 'avatar',
            role: 'user',
            is_followed: false,
        },
        labels_order: ['Група'],
        created: 1700000000,
        updated: 1700000000,
        content_type: 'anime',
        description: 'Опис',
        tags: [],
        reference: 'reference',
        spoiler: false,
        entries: content.length,
        title: 'Колекція',
        nsfw: false,
        comments_count: 0,
        vote_score: 0,
        my_score: 0,
        collection: content.map(entry),
    });

    it('resolves a valid response and rejects an invalid one', async () => {
        const client = createRequestClient({ baseUrl: 'http://api.test' });
        const path = { reference: 'reference' };

        respond(collection(Object.values(VARIANTS)));
        const { data } = await getCollection({
            client,
            path,
            throwOnError: true,
        });
        expect(data.collection.map((item) => item.content)).toEqual(
            Object.values(VARIANTS),
        );

        respond(collection([REJECTED['unknown data_type']]));
        await expect(
            getCollection({ client, path, throwOnError: true }),
        ).rejects.toBeInstanceOf(HikkaApiError);
    });
});
