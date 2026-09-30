import {
    CancelledError,
    type FetchQueryOptions,
    hashKey,
    QueryClient,
} from '@tanstack/react-query';
import { isNotFound } from '@tanstack/react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
    animeSlugOptions,
    type Client,
    ContentTypeEnum,
    characterInfoOptions,
    configureBrowserClient,
    createRequestClient,
    FavouriteContentTypeEnum,
    getArticleOptions,
    getBrowserClient,
    getCollectionOptions,
    getEditOptions,
    getFavouriteOptions,
    HikkaApiError,
    mangaInfoOptions,
    novelInfoOptions,
    personInfoOptions,
    ReadContentTypeEnum,
    readGetOptions,
    userProfileOptions,
    watchGetOptions,
} from '@hikka/api';

import {
    type ContentInfoType,
    contentInfoOptions,
    favouriteEntryOptions,
    fetchContentForLoader,
    listEntryOptions,
} from './content-queries';

const BASE_URL = 'https://api.example.test';
const slug = 'cowboy-bebop-f6f0ab';

const EXPECTED = {
    anime: {
        key: [{ _id: 'watchGet', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/watch/${slug}`,
    },
    manga: {
        key: [
            {
                _id: 'readGet',
                baseUrl: BASE_URL,
                path: { slug, content_type: ReadContentTypeEnum.MANGA },
            },
        ],
        url: `${BASE_URL}/read/manga/${slug}`,
    },
    novel: {
        key: [
            {
                _id: 'readGet',
                baseUrl: BASE_URL,
                path: { slug, content_type: ReadContentTypeEnum.NOVEL },
            },
        ],
        url: `${BASE_URL}/read/novel/${slug}`,
    },
};

const LEGACY_HOOK_OPTIONS = {
    anime: () => watchGetOptions({ path: { slug } }),
    manga: () =>
        readGetOptions({
            path: { slug, content_type: ReadContentTypeEnum.MANGA },
        }),
    novel: () =>
        readGetOptions({
            path: { slug, content_type: ReadContentTypeEnum.NOVEL },
        }),
};

const LOADER_OPTIONS = {
    anime: (client: Client) => watchGetOptions({ path: { slug }, client }),
    manga: (client: Client) =>
        readGetOptions({
            path: { slug, content_type: ReadContentTypeEnum.MANGA },
            client,
        }),
    novel: (client: Client) =>
        readGetOptions({
            path: { slug, content_type: ReadContentTypeEnum.NOVEL },
            client,
        }),
};

function ssrRequestClient() {
    return createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken: 'token',
    });
}

async function requestedUrl(
    options: Pick<FetchQueryOptions, 'queryKey'>,
): Promise<string | undefined> {
    let url: string | undefined;
    getBrowserClient().setConfig({
        fetch: async (input) => {
            url = input instanceof Request ? input.url : String(input);
            return new Response(null, { status: 401 });
        },
    });
    await new QueryClient()
        .fetchQuery(options as FetchQueryOptions)
        .catch(() => undefined);
    return url;
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

describe.each(['anime', 'manga', 'novel'] as const)(
    'listEntryOptions(%s)',
    (type) => {
        it('keeps the key and shape of the legacy hook options', () => {
            const options = listEntryOptions(type, slug);
            const legacy = LEGACY_HOOK_OPTIONS[type]();

            expect(options.queryKey).toEqual(EXPECTED[type].key);
            expect(options.queryKey).toEqual(legacy.queryKey);
            expect(Object.keys(options)).toEqual(Object.keys(legacy));
        });

        it('shares the key with the logged-in loader prefetch', () => {
            const client = ssrRequestClient();

            expect(listEntryOptions(type, slug).queryKey).toEqual(
                LOADER_OPTIONS[type](client).queryKey,
            );
            expect(listEntryOptions(type, slug, client).queryKey).toEqual(
                listEntryOptions(type, slug).queryKey,
            );
        });

        it('requests the same URL as the legacy hook options', async () => {
            expect(await requestedUrl(listEntryOptions(type, slug))).toBe(
                EXPECTED[type].url,
            );
            expect(await requestedUrl(LEGACY_HOOK_OPTIONS[type]())).toBe(
                EXPECTED[type].url,
            );
        });
    },
);

async function fetchWithStatus(
    options: Pick<FetchQueryOptions, 'queryKey'>,
    status: number,
): Promise<unknown> {
    getBrowserClient().setConfig({
        fetch: async () =>
            new Response(JSON.stringify({ message: 'Error', code: 'error' }), {
                status,
                headers: { 'Content-Type': 'application/json' },
            }),
    });
    return new QueryClient()
        .fetchQuery(options as FetchQueryOptions)
        .catch((reason: unknown) => reason);
}

describe.each(['anime', 'manga', 'novel'] as const)(
    'listEntryOptions(%s) response mapping',
    (type) => {
        it('resolves an untracked entry (404) to null', async () => {
            expect(
                await fetchWithStatus(listEntryOptions(type, slug), 404),
            ).toBeNull();
        });

        it('keeps any other error an error', async () => {
            const error = await fetchWithStatus(
                listEntryOptions(type, slug),
                500,
            );

            expect(error).toBeInstanceOf(HikkaApiError);
            expect((error as HikkaApiError).status).toBe(500);
        });

        it('hashes to the generated key', () => {
            expect(hashKey(listEntryOptions(type, slug).queryKey)).toBe(
                hashKey(LEGACY_HOOK_OPTIONS[type]().queryKey),
            );
        });
    },
);

const FAVOURITE_CASES = [
    FavouriteContentTypeEnum.ANIME,
    FavouriteContentTypeEnum.MANGA,
    FavouriteContentTypeEnum.NOVEL,
    FavouriteContentTypeEnum.CHARACTER,
    FavouriteContentTypeEnum.PERSON,
    FavouriteContentTypeEnum.COLLECTION,
];

describe.each(FAVOURITE_CASES)('favouriteEntryOptions(%s)', (content_type) => {
    const generated = (client?: Client) =>
        getFavouriteOptions({ path: { content_type, slug }, client });

    it('keeps the key and shape of the generated options', () => {
        const options = favouriteEntryOptions(content_type, slug);

        expect(options.queryKey).toEqual([
            {
                _id: 'getFavourite',
                baseUrl: BASE_URL,
                path: { content_type, slug },
            },
        ]);
        expect(hashKey(options.queryKey)).toBe(hashKey(generated().queryKey));
        expect(Object.keys(options)).toEqual(Object.keys(generated()));
    });

    it('shares the key with the logged-in loader prefetch', () => {
        const client = ssrRequestClient();

        expect(
            hashKey(favouriteEntryOptions(content_type, slug, client).queryKey),
        ).toBe(hashKey(favouriteEntryOptions(content_type, slug).queryKey));
    });

    it('requests the generated URL', async () => {
        const url = `${BASE_URL}/favourite/${content_type}/${slug}`;

        expect(
            await requestedUrl(favouriteEntryOptions(content_type, slug)),
        ).toBe(url);
        expect(await requestedUrl(generated())).toBe(url);
    });

    it('resolves a missing favourite (404) to null', async () => {
        expect(
            await fetchWithStatus(
                favouriteEntryOptions(content_type, slug),
                404,
            ),
        ).toBeNull();
    });

    it('keeps any other error an error', async () => {
        const error = await fetchWithStatus(
            favouriteEntryOptions(content_type, slug),
            401,
        );

        expect(error).toBeInstanceOf(HikkaApiError);
        expect((error as HikkaApiError).status).toBe(401);
    });
});

const editId = '12345';

const INFO_CASES = {
    [ContentTypeEnum.ANIME]: {
        slug,
        key: [{ _id: 'animeSlug', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/anime/${slug}`,
        legacy: () => animeSlugOptions({ path: { slug } }),
        loader: (client: Client) =>
            animeSlugOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.MANGA]: {
        slug,
        key: [{ _id: 'mangaInfo', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/manga/${slug}`,
        legacy: () => mangaInfoOptions({ path: { slug } }),
        loader: (client: Client) =>
            mangaInfoOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.NOVEL]: {
        slug,
        key: [{ _id: 'novelInfo', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/novel/${slug}`,
        legacy: () => novelInfoOptions({ path: { slug } }),
        loader: (client: Client) =>
            novelInfoOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.CHARACTER]: {
        slug,
        key: [{ _id: 'characterInfo', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/characters/${slug}`,
        legacy: () => characterInfoOptions({ path: { slug } }),
        loader: (client: Client) =>
            characterInfoOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.PERSON]: {
        slug,
        key: [{ _id: 'personInfo', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/people/${slug}`,
        legacy: () => personInfoOptions({ path: { slug } }),
        loader: (client: Client) =>
            personInfoOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.COLLECTION]: {
        slug,
        key: [
            {
                _id: 'getCollection',
                baseUrl: BASE_URL,
                path: { reference: slug },
            },
        ],
        url: `${BASE_URL}/collections/${slug}`,
        legacy: () => getCollectionOptions({ path: { reference: slug } }),
        loader: (client: Client) =>
            getCollectionOptions({ path: { reference: slug }, client }),
    },
    [ContentTypeEnum.EDIT]: {
        slug: editId,
        key: [
            {
                _id: 'getEdit',
                baseUrl: BASE_URL,
                path: { edit_id: Number(editId) },
            },
        ],
        url: `${BASE_URL}/edit/${editId}`,
        legacy: () => getEditOptions({ path: { edit_id: Number(editId) } }),
        loader: (client: Client) =>
            getEditOptions({ path: { edit_id: Number(editId) }, client }),
    },
    [ContentTypeEnum.ARTICLE]: {
        slug,
        key: [{ _id: 'getArticle', baseUrl: BASE_URL, path: { slug } }],
        url: `${BASE_URL}/articles/${slug}`,
        legacy: () => getArticleOptions({ path: { slug } }),
        loader: (client: Client) =>
            getArticleOptions({ path: { slug }, client }),
    },
    [ContentTypeEnum.USER]: {
        slug,
        key: [
            { _id: 'userProfile', baseUrl: BASE_URL, path: { username: slug } },
        ],
        url: `${BASE_URL}/user/${slug}`,
        legacy: () => userProfileOptions({ path: { username: slug } }),
        loader: (client: Client) =>
            userProfileOptions({ path: { username: slug }, client }),
    },
} satisfies Record<ContentInfoType, unknown>;

const INFO_TYPES = Object.keys(INFO_CASES) as ContentInfoType[];

describe.each(INFO_TYPES)('contentInfoOptions(%s)', (type) => {
    const infoCase = INFO_CASES[type];

    it('keeps the key and shape of the legacy component query', () => {
        const options = contentInfoOptions(type, infoCase.slug);
        const legacy = infoCase.legacy();

        expect(options.queryKey).toEqual(infoCase.key);
        expect(options.queryKey).toEqual(legacy.queryKey);
        expect(Object.keys(options)).toEqual(Object.keys(legacy));
    });

    it('shares the key between the SSR loader and the component', () => {
        const client = ssrRequestClient();
        const loaderKey = contentInfoOptions(
            type,
            infoCase.slug,
            client,
        ).queryKey;

        expect(loaderKey).toEqual(infoCase.loader(client).queryKey);
        expect(loaderKey).toEqual(
            contentInfoOptions(type, infoCase.slug).queryKey,
        );
        expect(loaderKey).toEqual(infoCase.legacy().queryKey);
    });

    it('requests the same URL as the legacy component query', async () => {
        expect(
            await requestedUrl(contentInfoOptions(type, infoCase.slug)),
        ).toBe(infoCase.url);
        expect(await requestedUrl(infoCase.legacy())).toBe(infoCase.url);
    });
});

const apiClient = createRequestClient({ baseUrl: 'https://api.hikka.io' });

function createQueryClient(ensureQueryData: ReturnType<typeof vi.fn>) {
    return { ensureQueryData } as unknown as QueryClient;
}

describe('fetchContentForLoader', () => {
    it('retries a fetch cancelled by an unmounting observer and resolves', async () => {
        const ensureQueryData = vi
            .fn()
            .mockRejectedValueOnce(new CancelledError())
            .mockResolvedValueOnce({ slug });

        await expect(
            fetchContentForLoader(ContentTypeEnum.ANIME, slug, {
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).resolves.toEqual({ slug });
        expect(ensureQueryData).toHaveBeenCalledTimes(2);
        expect(ensureQueryData.mock.lastCall?.[0].queryKey).toEqual(
            animeSlugOptions({ path: { slug }, client: apiClient }).queryKey,
        );
    });

    it('turns a 404 from the API into the router not-found', async () => {
        const ensureQueryData = vi
            .fn()
            .mockRejectedValue(
                new HikkaApiError('Not found', 404, 'not_found'),
            );

        const error = await fetchContentForLoader(ContentTypeEnum.MANGA, slug, {
            queryClient: createQueryClient(ensureQueryData),
            apiClient,
        }).catch((reason: unknown) => reason);

        expect(isNotFound(error)).toBe(true);
        expect(ensureQueryData).toHaveBeenCalledTimes(1);
    });

    it('rethrows any other API error unchanged', async () => {
        const apiError = new HikkaApiError('Server error', 500, 'server_error');
        const ensureQueryData = vi.fn().mockRejectedValue(apiError);

        await expect(
            fetchContentForLoader(ContentTypeEnum.USER, slug, {
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).rejects.toBe(apiError);
    });

    it.each(INFO_TYPES)('ensures the loader query of %s', async (type) => {
        const infoCase = INFO_CASES[type];
        const ensureQueryData = vi.fn().mockResolvedValue({ type });

        await expect(
            fetchContentForLoader(type, infoCase.slug, {
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).resolves.toEqual({ type });
        expect(ensureQueryData).toHaveBeenCalledTimes(1);
        expect(ensureQueryData.mock.lastCall?.[0].queryKey).toEqual(
            infoCase.loader(apiClient).queryKey,
        );
    });

    it.each([
        ContentTypeEnum.COMMENT,
        ContentTypeEnum.HISTORY,
        'toString' as ContentTypeEnum,
    ])('resolves null without fetching for %s', async (type) => {
        const ensureQueryData = vi.fn();

        await expect(
            fetchContentForLoader(type, slug, {
                queryClient: createQueryClient(ensureQueryData),
                apiClient,
            }),
        ).resolves.toBeNull();
        expect(ensureQueryData).not.toHaveBeenCalled();
    });
});
