import { type FetchQueryOptions, QueryClient } from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    type Client,
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    ReadContentTypeEnum,
    readGetOptions,
    watchGetOptions,
} from '@hikka/api';

import { listEntryOptions } from './content-queries';

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

describe.each([
    'anime',
    'manga',
    'novel',
] as const)('listEntryOptions(%s)', (type) => {
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
});
