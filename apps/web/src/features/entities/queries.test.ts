import {
    type FetchInfiniteQueryOptions,
    hashKey,
    QueryClient,
} from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    ContentTypeEnum,
    characterAnimeInfiniteOptions,
    characterMangaInfiniteOptions,
    characterNovelInfiniteOptions,
    characterVoicesInfiniteOptions,
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    paginationPageParam,
    personAnimeInfiniteOptions,
    personMangaInfiniteOptions,
    personNovelInfiniteOptions,
    personVoicesInfiniteOptions,
} from '@hikka/api';

import {
    ENTITY_APPEARANCE_LISTS,
    ENTITY_PREVIEW_SIZE,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from './queries';

const BASE_URL = 'https://api.example.test';
const slug = 'test-slug';

const GENERATED = {
    [ContentTypeEnum.CHARACTER]: {
        anime: ['characterAnime', characterAnimeInfiniteOptions, 'anime'],
        manga: ['characterManga', characterMangaInfiniteOptions, 'manga'],
        novel: ['characterNovel', characterNovelInfiniteOptions, 'novel'],
        voices: ['characterVoices', characterVoicesInfiniteOptions, 'voices'],
    },
    [ContentTypeEnum.PERSON]: {
        anime: ['personAnime', personAnimeInfiniteOptions, 'anime'],
        manga: ['personManga', personMangaInfiniteOptions, 'manga'],
        novel: ['personNovel', personNovelInfiniteOptions, 'novel'],
        voices: ['personVoices', personVoicesInfiniteOptions, 'characters'],
    },
} as const;

const URL_PREFIX = {
    [ContentTypeEnum.CHARACTER]: 'characters',
    [ContentTypeEnum.PERSON]: 'people',
};

const CASES = (
    [ContentTypeEnum.CHARACTER, ContentTypeEnum.PERSON] as EntityType[]
).flatMap((type) =>
    ENTITY_APPEARANCE_LISTS.map((list) => [type, list] as const),
);

type Key = readonly [Record<string, unknown>];

const keyOf = (
    type: EntityType,
    list: EntityAppearanceList,
    preview: boolean,
    client?: ReturnType<typeof createRequestClient>,
) =>
    (
        entityAppearanceOptions(type, list, slug, { preview }, client) as {
            queryKey: Key;
        }
    ).queryKey;

async function requestedUrl(options: object): Promise<string | undefined> {
    let url: string | undefined;
    getBrowserClient().setConfig({
        fetch: async (input) => {
            url = input instanceof Request ? input.url : String(input);
            return new Response(null, { status: 401 });
        },
    });
    await new QueryClient()
        .fetchInfiniteQuery({
            ...options,
            ...paginationPageParam(),
        } as unknown as FetchInfiniteQueryOptions)
        .catch(() => undefined);
    return url;
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

describe.each(CASES)('entityAppearanceOptions(%s, %s)', (type, list) => {
    const [id, generated] = GENERATED[type][list];

    it('keeps the generated key for the full list', () => {
        expect(keyOf(type, list, false)).toEqual([
            { _id: id, baseUrl: BASE_URL, _infinite: true, path: { slug } },
        ]);
        expect(hashKey(keyOf(type, list, false))).toBe(
            hashKey(generated({ path: { slug } }).queryKey),
        );
    });

    it('differs from the full list only by the preview size', () => {
        const [{ query, ...preview }] = keyOf(type, list, true);
        const [full] = keyOf(type, list, false);

        expect(query).toEqual({ size: ENTITY_PREVIEW_SIZE });
        expect(preview).toEqual(full);
        expect(ENTITY_PREVIEW_SIZE).toBe(4);
    });

    it.each([true, false])(
        'shares the key between the loader and the component (preview %s)',
        (preview) => {
            const client = createRequestClient({
                baseUrl: BASE_URL,
                internalBaseUrl: 'http://backend:8000',
                authToken: 'token',
            });

            expect(hashKey(keyOf(type, list, preview, client))).toBe(
                hashKey(keyOf(type, list, preview)),
            );
        },
    );

    it('requests the first page at the preview size', async () => {
        const base = `${BASE_URL}/${URL_PREFIX[type]}/${slug}/${GENERATED[type][list][2]}`;

        expect(
            await requestedUrl(
                entityAppearanceOptions(type, list, slug, { preview: true }),
            ),
        ).toBe(`${base}?size=${ENTITY_PREVIEW_SIZE}&page=1`);
        expect(
            await requestedUrl(entityAppearanceOptions(type, list, slug)),
        ).toBe(`${base}?page=1`);
    });
});
