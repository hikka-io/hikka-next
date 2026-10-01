import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
    type Client,
    ContentTypeEnum,
    configureBrowserClient,
    createRequestClient,
    type MainContentTypeEnum,
    paginatedInfiniteOptions,
    searchAnimeInfiniteOptions,
    searchMangaInfiniteOptions,
    searchNovelInfiniteOptions,
} from '@hikka/api';

import { useFiltersSidebar } from '@/features/filters';
import {
    UiPreferencesProvider,
    useUiPreferences,
} from '@/services/ui-preferences-store';
import {
    CATALOG_FILTERS_SIDEBAR_KEY,
    type UiPreferences,
    type View,
} from '@/utils/cookies';
import {
    animeSearchSchema,
    mangaSearchSchema,
    novelSearchSchema,
} from '@/utils/search-schemas';

import { Route as AnimeRoute } from '../../routes/_pages/anime/index';
import { Route as MangaRoute } from '../../routes/_pages/manga/index';
import { Route as NovelRoute } from '../../routes/_pages/novel/index';
import {
    CATALOG_VIEW_KEY,
    catalogColumns,
    catalogPageSize,
    catalogSearchOptions,
} from './queries';
import {
    buildAnimeSearchArgs,
    buildMangaSearchArgs,
    buildNovelSearchArgs,
} from './search-args';
import { useCatalogView } from './use-catalog-view';

const cookies = vi.hoisted(() => ({
    uiPrefs: null as UiPreferences | null,
    unreadable: false,
}));

vi.mock('@/utils/cookies/read', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/cookies/read')>()),
    readUiPrefs: async () => {
        if (cookies.unreadable) throw new Error('cookie read failed');
        return cookies.uiPrefs;
    },
}));

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

afterEach(() => {
    cookies.uiPrefs = null;
    cookies.unreadable = false;
    vi.unstubAllGlobals();
});

const prefs = (
    view: View | undefined,
    sidebar: boolean | undefined,
): UiPreferences => ({
    views: view ? { [CATALOG_VIEW_KEY]: view } : {},
    filters: {},
    collapsibles:
        sidebar === undefined ? {} : { [CATALOG_FILTERS_SIDEBAR_KEY]: sidebar },
});

const LAYOUTS: {
    name: string;
    prefs: UiPreferences | null;
    columns: number;
    size: number | undefined;
}[] = [
    { name: 'no cookie', prefs: null, columns: 5, size: 20 },
    {
        name: 'empty cookie',
        prefs: prefs(undefined, undefined),
        columns: 5,
        size: 20,
    },
    {
        name: 'grid, sidebar on',
        prefs: prefs('grid', true),
        columns: 5,
        size: 20,
    },
    {
        name: 'grid, sidebar off',
        prefs: prefs('grid', false),
        columns: 7,
        size: 28,
    },
    {
        name: 'list, sidebar on',
        prefs: prefs('list', true),
        columns: 1,
        size: undefined,
    },
    {
        name: 'list, sidebar off',
        prefs: prefs('list', false),
        columns: 1,
        size: undefined,
    },
    {
        name: 'table, sidebar on',
        prefs: prefs('table', true),
        columns: 5,
        size: 20,
    },
    {
        name: 'default view, sidebar off',
        prefs: prefs(undefined, false),
        columns: 7,
        size: 28,
    },
];

const TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
] as const;

const RAW_SEARCH = {
    statuses: ['ongoing'],
    genres: ['action'],
    sort: 'start_date',
    order: 'asc',
    page: '3',
};

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

// Copy of the options HEAD built inside use-catalog-search-query.ts.
function componentOptions(
    type: MainContentTypeEnum,
    raw: object,
    size?: number,
) {
    const search = parseSearch(type, raw);

    switch (type) {
        case ContentTypeEnum.ANIME: {
            const { args, page } = buildAnimeSearchArgs(search);
            return paginatedInfiniteOptions(
                searchAnimeInfiniteOptions({ body: args, query: { size } }),
                page,
            );
        }
        case ContentTypeEnum.MANGA: {
            const { args, page } = buildMangaSearchArgs(search);
            return paginatedInfiniteOptions(
                searchMangaInfiniteOptions({ body: args, query: { size } }),
                page,
            );
        }
        case ContentTypeEnum.NOVEL: {
            const { args, page } = buildNovelSearchArgs(search);
            return paginatedInfiniteOptions(
                searchNovelInfiniteOptions({ body: args, query: { size } }),
                page,
            );
        }
    }
}

const ROUTES = {
    [ContentTypeEnum.ANIME]: AnimeRoute,
    [ContentTypeEnum.MANGA]: MangaRoute,
    [ContentTypeEnum.NOVEL]: NovelRoute,
};

const requestClient = (): Client =>
    createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
    });

function fakeQueryClient() {
    const calls: { method: string; hash: string }[] = [];
    let resolvePrefetch!: () => void;
    const prefetched = new Promise<void>((resolve) => {
        resolvePrefetch = resolve;
    });

    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        prefetchInfiniteQuery: vi.fn(
            (options: { queryKey: readonly unknown[] }) => {
                calls.push({
                    method: 'prefetch',
                    hash: hashKey(options.queryKey),
                });
                return prefetched;
            },
        ),
    });

    return { queryClient, calls, resolvePrefetch };
}

const runLoader = (
    type: MainContentTypeEnum,
    ctx: { queryClient: QueryClient; search: object; preload?: boolean },
) =>
    (ROUTES[type].options.loader as (ctx: unknown) => Promise<unknown>)({
        deps: ctx.search,
        preload: ctx.preload ?? false,
        context: { queryClient: ctx.queryClient, apiClient: requestClient() },
    });

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('catalog page size', () => {
    it.each(LAYOUTS)('$name', ({ prefs, columns, size }) => {
        expect(catalogColumns(prefs, CATALOG_VIEW_KEY)).toBe(columns);
        expect(catalogPageSize(prefs, CATALOG_VIEW_KEY)).toBe(size);
    });

    it.each(LAYOUTS)(
        'agrees with the rendered view and sidebar hooks: $name',
        ({ prefs }) => {
            let rendered: { view: View; sidebar: boolean; size?: number } = {
                view: 'grid',
                sidebar: true,
            };

            function Probe() {
                const { view } = useCatalogView(CATALOG_VIEW_KEY);
                const { visible } = useFiltersSidebar();
                const size = useUiPreferences((state) =>
                    catalogPageSize(state, CATALOG_VIEW_KEY),
                );
                rendered = { view, sidebar: visible, size };
                return null;
            }

            renderToStaticMarkup(
                createElement(UiPreferencesProvider, {
                    initial: prefs,
                    children: createElement(Probe),
                }),
            );

            const expected =
                rendered.view === 'list'
                    ? undefined
                    : (rendered.sidebar ? 5 : 7) * 4;

            expect(rendered.size).toBe(expected);
            expect(catalogPageSize(prefs, CATALOG_VIEW_KEY)).toBe(expected);
        },
    );
});

describe('catalogSearchOptions', () => {
    const cases = TYPES.flatMap((type) =>
        LAYOUTS.map((layout) => ({ type, ...layout })),
    );

    it.each(cases)(
        'keeps the component key: $type, $name',
        ({ type, prefs }) => {
            const size = catalogPageSize(prefs, CATALOG_VIEW_KEY);
            const search = parseSearch(type, RAW_SEARCH);

            expect(
                hashKey(
                    catalogSearchOptions(type, search, size, requestClient())
                        .queryKey,
                ),
            ).toBe(hashKey(componentOptions(type, RAW_SEARCH, size).queryKey));
        },
    );

    it.each(TYPES)('keys the page and the size: %s', (type) => {
        const search = parseSearch(type, RAW_SEARCH);
        const key = hashKey(catalogSearchOptions(type, search, 20).queryKey);

        expect(
            hashKey(
                catalogSearchOptions(type, { ...search, page: 4 }, 20).queryKey,
            ),
        ).not.toBe(key);
        expect(
            hashKey(catalogSearchOptions(type, search, 28).queryKey),
        ).not.toBe(key);
    });

    it.each(TYPES)('starts at the url page: %s', (type) => {
        const search = parseSearch(type, RAW_SEARCH);
        const options = catalogSearchOptions(type, search, 20);

        expect(options.initialPageParam).toBe(3);
    });
});

describe('catalog route loaders', () => {
    const cases = TYPES.flatMap((type) =>
        LAYOUTS.map((layout) => ({ type, ...layout })),
    );

    it.each(cases)(
        'awaits the component key prefetch on the server: $type, $name',
        async ({ type, prefs }) => {
            vi.stubGlobal('window', undefined);
            cookies.uiPrefs = prefs;
            const { queryClient, calls, resolvePrefetch } = fakeQueryClient();
            const search = parseSearch(type, RAW_SEARCH);

            let settled = false;
            const result = runLoader(type, { queryClient, search }).then(() => {
                settled = true;
            });

            await flush();
            expect(calls).toEqual([
                {
                    method: 'prefetch',
                    hash: hashKey(
                        componentOptions(
                            type,
                            RAW_SEARCH,
                            catalogPageSize(prefs, CATALOG_VIEW_KEY),
                        ).queryKey,
                    ),
                },
            ]);
            expect(settled).toBe(false);

            resolvePrefetch();
            await result;
            expect(settled).toBe(true);
        },
    );

    it.each(TYPES)(
        'renders the page when the server fetch fails: %s',
        async (type) => {
            vi.stubGlobal('window', undefined);
            const queryClient = new QueryClient();
            Object.assign(queryClient, {
                fetchInfiniteQuery: vi.fn(async () => {
                    throw new Error('backend down');
                }),
            });

            await expect(
                runLoader(type, {
                    queryClient,
                    search: parseSearch(type, RAW_SEARCH),
                }),
            ).resolves.toBeUndefined();
        },
    );

    it.each(TYPES)(
        'renders the page when the ui prefs cannot be read: %s',
        async (type) => {
            vi.stubGlobal('window', undefined);
            cookies.unreadable = true;
            const { queryClient, calls } = fakeQueryClient();

            await expect(
                runLoader(type, {
                    queryClient,
                    search: parseSearch(type, RAW_SEARCH),
                }),
            ).resolves.toBeUndefined();
            expect(calls).toEqual([]);
        },
    );

    it.each(TYPES)(
        'skips the client prefetch when the ui prefs cannot be read: %s',
        async (type) => {
            cookies.unreadable = true;
            const { queryClient, calls } = fakeQueryClient();

            await expect(
                runLoader(type, {
                    queryClient,
                    search: parseSearch(type, RAW_SEARCH),
                }),
            ).resolves.toBeUndefined();
            await flush();
            expect(calls).toEqual([]);
        },
    );

    it.each(cases)(
        'prefetches without blocking on the client: $type, $name',
        async ({ type, prefs }) => {
            cookies.uiPrefs = prefs;
            const { queryClient, calls } = fakeQueryClient();
            const search = parseSearch(type, RAW_SEARCH);

            await expect(
                runLoader(type, { queryClient, search }),
            ).resolves.toBeUndefined();
            expect(calls).toEqual([
                {
                    method: 'prefetch',
                    hash: hashKey(
                        componentOptions(
                            type,
                            RAW_SEARCH,
                            catalogPageSize(prefs, CATALOG_VIEW_KEY),
                        ).queryKey,
                    ),
                },
            ]);
        },
    );

    it.each(TYPES)('skips a preload: %s', async (type) => {
        const { queryClient, calls } = fakeQueryClient();

        await runLoader(type, {
            queryClient,
            search: parseSearch(type, RAW_SEARCH),
            preload: true,
        });
        vi.stubGlobal('window', undefined);
        await runLoader(type, {
            queryClient,
            search: parseSearch(type, RAW_SEARCH),
            preload: true,
        });

        expect(calls).toEqual([]);
    });

    it.each(TYPES)('keys the loader deps on the search: %s', (type) => {
        const loaderDeps = ROUTES[type].options.loaderDeps as (ctx: {
            search: object;
        }) => unknown;
        const search = parseSearch(type, RAW_SEARCH);

        expect(loaderDeps({ search })).toEqual(search);
    });
});
