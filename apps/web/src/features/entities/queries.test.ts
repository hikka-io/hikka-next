import {
    CancelledError,
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
    profileQueryKey,
} from '@hikka/api';

import {
    ENTITY_APPEARANCE_LISTS,
    type EntityAppearanceList,
    type EntityType,
    entityAppearanceOptions,
} from '@/utils/api/content-queries';

import { Route as CharacterAnimeRoute } from '../../routes/_pages/characters/$slug/anime';
import { Route as CharacterOverviewRoute } from '../../routes/_pages/characters/$slug/index';
import { Route as CharacterMangaRoute } from '../../routes/_pages/characters/$slug/manga';
import { Route as CharacterNovelRoute } from '../../routes/_pages/characters/$slug/novel';
import { Route as CharacterVoicesRoute } from '../../routes/_pages/characters/$slug/voices';
import { Route as PersonAnimeRoute } from '../../routes/_pages/people/$slug/anime';
import { Route as PersonCharactersRoute } from '../../routes/_pages/people/$slug/characters';
import { Route as PersonOverviewRoute } from '../../routes/_pages/people/$slug/index';
import { Route as PersonMangaRoute } from '../../routes/_pages/people/$slug/manga';
import { Route as PersonNovelRoute } from '../../routes/_pages/people/$slug/novel';

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

        expect(query).toEqual({ size: 4 });
        expect(preview).toEqual(full);
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
        ).toBe(`${base}?size=4&page=1`);
        expect(
            await requestedUrl(entityAppearanceOptions(type, list, slug)),
        ).toBe(`${base}?page=1`);
    });
});

type LoaderRoute = { options: { loader?: unknown } };

async function runLoader(
    route: LoaderRoute,
    auth: 'anonymous' | 'authenticated',
    fail?: { id: string; error: Error; times: number },
) {
    const queryClient = new QueryClient();
    const calls: string[] = [];
    let failures = 0;

    if (auth === 'authenticated') {
        queryClient.setQueryData(profileQueryKey(), { username: 'tester' });
    }

    queryClient.fetchInfiniteQuery = (async (options: {
        queryKey: readonly [{ _id: string }];
        initialPageParam?: unknown;
        getNextPageParam?: unknown;
    }) => {
        const paged =
            options.initialPageParam === 1 &&
            typeof options.getNextPageParam === 'function';
        calls.push(
            `prefetchInfiniteQuery${paged ? '+page' : ''} ${JSON.stringify(options.queryKey)}`,
        );
        if (
            fail &&
            fail.id === options.queryKey[0]._id &&
            failures < fail.times
        ) {
            failures += 1;
            throw fail.error;
        }
        return { pages: [], pageParams: [] };
    }) as unknown as QueryClient['fetchInfiniteQuery'];

    const loader = route.options.loader as (ctx: unknown) => Promise<unknown>;
    const result = await loader({
        params: { slug },
        context: {
            queryClient,
            apiClient: createRequestClient({ baseUrl: BASE_URL }),
        },
    });

    return { calls, result };
}

const appearanceKey = (id: string, preview: boolean) =>
    `prefetchInfiniteQuery+page [{"_id":"${id}","baseUrl":"https://api.example.test","_infinite":true,"path":{"slug":"test-slug"}${preview ? ',"query":{"size":4}' : ''}}]`;

const ENTITY_CHILD_ROUTES = [
    [
        'character overview',
        CharacterOverviewRoute,
        [
            'characterAnime',
            'characterManga',
            'characterNovel',
            'characterVoices',
        ].map((id) => appearanceKey(id, true)),
    ],
    [
        'person overview',
        PersonOverviewRoute,
        ['personAnime', 'personManga', 'personNovel', 'personVoices'].map(
            (id) => appearanceKey(id, true),
        ),
    ],
    [
        'character anime tab',
        CharacterAnimeRoute,
        [appearanceKey('characterAnime', false)],
    ],
    [
        'character manga tab',
        CharacterMangaRoute,
        [appearanceKey('characterManga', false)],
    ],
    [
        'character novel tab',
        CharacterNovelRoute,
        [appearanceKey('characterNovel', false)],
    ],
    [
        'character voices tab',
        CharacterVoicesRoute,
        [appearanceKey('characterVoices', false)],
    ],
    [
        'person anime tab',
        PersonAnimeRoute,
        [appearanceKey('personAnime', false)],
    ],
    [
        'person characters tab',
        PersonCharactersRoute,
        [appearanceKey('personVoices', false)],
    ],
    [
        'person manga tab',
        PersonMangaRoute,
        [appearanceKey('personManga', false)],
    ],
    [
        'person novel tab',
        PersonNovelRoute,
        [appearanceKey('personNovel', false)],
    ],
] as const;

describe.each(ENTITY_CHILD_ROUTES)('%s loader', (_, route, expected) => {
    it.each(['anonymous', 'authenticated'] as const)(
        'prefetches only its own lists (%s)',
        async (auth) => {
            const { calls, result } = await runLoader(route, auth);

            expect(calls).toEqual(expected);
            expect(result).toBeUndefined();
        },
    );

    it('resolves when a list fails', async () => {
        const first = expected[0];
        const failed = await runLoader(route, 'anonymous', {
            id: JSON.parse(first.slice(first.indexOf(' ') + 1))[0]._id,
            error: new CancelledError(),
            times: 1,
        });

        expect(failed.calls).toEqual(expected);
    });
});
