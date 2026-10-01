import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CancelledError, hashKey, QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type Client,
    type CollectionsListArgs,
    type ContentStatusEnum,
    configureBrowserClient,
    createRequestClient,
    type FavouriteContentTypeEnum,
    favouriteListInfiniteOptions,
    getArticlesInfiniteOptions,
    getBrowserClient,
    getCollectionsInfiniteOptions,
    type MangaMediaEnum,
    type NovelMediaEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    userHistoryInfiniteOptions,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    type UserlistSearch,
    userlistSearchSchema,
} from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

import { Route as LayoutRoute } from '../../routes/_pages/u/$username';
import { Route as FavoritesRoute } from '../../routes/_pages/u/$username/favorites';
import { Route as HistoryRoute } from '../../routes/_pages/u/$username/history';
import { Route as ProfileRoute } from '../../routes/_pages/u/$username/index';
import { Route as ListRoute } from '../../routes/_pages/u/$username/list/$content_type';
import { useUserList } from './list/use-user-list';
import UserArticles from './profile/user-articles';
import UserCollections from './profile/user-collections';
import FavoriteSection from './profile/user-favorites/components/favorite-section';
import HistoryModal from './profile/user-history/history-modal';
import UserHistory from './profile/user-history/user-history';
import {
    FAVOURITES_PREVIEW_SIZE,
    userArticlesPreviewOptions,
    userCollectionsOptions,
    userFavouritesOptions,
    userHistoryPreviewOptions,
    userListOptions,
} from './queries';

const mocks = vi.hoisted(() => ({
    params: {} as Record<string, string>,
    search: {} as Record<string, unknown>,
    list: undefined as unknown[] | undefined,
    infiniteListCalls: [] as unknown[][],
    visible: false,
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    Link: ({ children }: { children?: unknown }) => children,
    useParams: () => mocks.params,
    useRouteSearch: () => mocks.search,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.infiniteListCalls.push(args);
        return { list: mocks.list, isPending: mocks.list === undefined };
    },
}));

vi.mock('@/services/session/use-session', async (importOriginal) => ({
    ...(await importOriginal<
        typeof import('@/services/session/use-session')
    >()),
    useSession: () => ({ user: undefined }),
}));

vi.mock('@/services/hooks/use-close-on-route-change', () => ({
    useCloseOnRouteChange: () => {},
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: () => null,
    ResponsiveModalContent: () => null,
}));

vi.mock('@/services/hooks/use-visible-once', () => ({
    useVisibleOnce: () => ({ ref: () => {}, visible: mocks.visible }),
}));

const BASE_URL = 'https://api.example.test';
const username = 'tester';

type LoaderRoute = { options: { beforeLoad?: unknown; loader?: unknown } };

type RecordedOptions = {
    queryKey: readonly unknown[];
    initialPageParam?: unknown;
};

type CapturedOptions = { queryKey: readonly unknown[] };

function serialize(value: unknown) {
    return JSON.stringify(value, (_, inner) =>
        inner === undefined ? '<undefined>' : inner,
    );
}

function ssrRequestClient() {
    return createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken: 'token',
    });
}

function recordingQueryClient() {
    const queryClient = new QueryClient();
    const calls: string[] = [];

    const record = (method: string) => async (options: RecordedOptions) => {
        calls.push(
            `${method} ${Object.keys(options).join(',')} ${serialize(options.initialPageParam)} ${serialize(options.queryKey)}`,
        );
        return method.includes('Infinite') ? { pages: [], pageParams: [] } : {};
    };

    Object.assign(queryClient, {
        ensureQueryData: record('ensureQueryData'),
        ensureInfiniteQueryData: record('ensureInfiniteQueryData'),
        prefetchQuery: record('prefetchQuery'),
        prefetchInfiniteQuery: record('prefetchInfiniteQuery'),
        fetchQuery: record('fetchQuery'),
        fetchInfiniteQuery: record('fetchInfiniteQuery'),
    });

    return { queryClient, calls };
}

async function sentRequest(options: CapturedOptions, client: Client) {
    let sent: Request | undefined;
    client.setConfig({
        fetch: async (input) => {
            sent =
                input instanceof Request ? input : new Request(String(input));
            return new Response(null, { status: 401 });
        },
    });
    const query = {
        ...options,
        ...paginationPageParam(),
    } as Parameters<QueryClient['fetchInfiniteQuery']>[0];
    await new QueryClient().fetchInfiniteQuery(query).catch(() => undefined);
    if (!sent) throw new Error('no request was sent');
    const url = new URL(sent.url);
    return {
        method: sent.method,
        path: `${url.pathname}${url.search}`,
        body: await sent.text(),
    };
}

function loaderRequestClient() {
    return createRequestClient({ baseUrl: BASE_URL, authToken: 'token' });
}

async function runLoader(
    route: LoaderRoute,
    params: Record<string, string>,
    deps?: unknown,
    side: 'server' | 'client' = 'server',
) {
    if (side === 'server') vi.stubGlobal('window', undefined);
    const { queryClient, calls } = recordingQueryClient();
    const beforeLoad = route.options.beforeLoad as
        | ((ctx: unknown) => unknown)
        | undefined;
    const loader = route.options.loader as (ctx: unknown) => Promise<unknown>;
    const context = { queryClient, apiClient: ssrRequestClient() };
    try {
        await beforeLoad?.({ params, search: deps, context });
        await loader({ params, deps, context });
    } catch (error) {
        if (!isRedirect(error)) throw error;
        calls.push(`redirect ${serialize(error.options)}`);
    }
    return calls;
}

// Copy of the options built in HEAD use-watch-list.ts.
function headUseWatchListOptions(
    search: UserlistSearch,
    params: Record<string, string>,
) {
    const watchStatus = search.status;

    const media_type = (search.types ?? []) as AnimeMediaEnum[];
    const status = (search.statuses ?? []) as AnimeStatusEnum[];
    const season = (search.seasons ?? []) as SeasonEnum[];
    const rating = (search.ratings ?? []) as AnimeAgeRatingEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const studios = search.studios ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;

    return userWatchListInfiniteOptions({
        path: { username: String(params.username) },
        body: {
            watch_status:
                watchStatus !== 'all'
                    ? (String(watchStatus) as WatchStatusEnum)
                    : undefined,
            media_type,
            status,
            season,
            rating,
            years,
            genres,
            studios,
            score,
            sort: expandSort('watch', search.sort, search.order),
        },
    });
}

// Copy of the options built in HEAD use-read-list.ts.
function headUseReadListOptions(
    search: UserlistSearch,
    params: Record<string, string>,
) {
    const readStatus = search.status as ReadStatusEnum | 'all';

    const media_type = (search.types ?? []) as (
        | NovelMediaEnum
        | MangaMediaEnum
    )[] as MangaMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const magazines = search.magazines ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;

    return userReadListInfiniteOptions({
        path: {
            content_type: params.content_type as ReadContentTypeEnum,
            username: String(params.username),
        },
        body: {
            read_status: readStatus !== 'all' ? readStatus : undefined,
            media_type,
            status,
            years,
            genres,
            magazines,
            score,
            sort: expandSort('read', search.sort, search.order),
        },
    });
}

// Copy of the list query in HEAD user-articles.tsx.
function headUserArticlesOptions(params: Record<string, string>) {
    return getArticlesInfiniteOptions({
        body: { author: String(params.username) },
        query: { size: 3 },
    });
}

// Copy of the body and list query in HEAD user-collections.tsx.
function headUserCollectionsBody(
    params: Record<string, string>,
): CollectionsListArgs {
    return {
        author: String(params.username),
        sort: ['created:desc'],
        only_public: false,
    };
}

function headUserCollectionsOptions(params: Record<string, string>) {
    return getCollectionsInfiniteOptions({
        body: headUserCollectionsBody(params),
    });
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    mocks.params = {};
    mocks.search = {};
    mocks.list = undefined;
    mocks.infiniteListCalls = [];
    mocks.visible = false;
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const LIST_CASES = [
    { name: 'anime, no search', type: 'anime', raw: {} },
    { name: 'anime, status only', type: 'anime', raw: { status: 'watching' } },
    {
        name: 'anime, default search',
        type: 'anime',
        raw: { status: 'completed', sort: 'watch_score' },
    },
    {
        name: 'anime, page 2',
        type: 'anime',
        raw: { status: 'completed', sort: 'watch_score', page: '2' },
    },
    {
        name: 'anime, table view ascending',
        type: 'anime',
        raw: {
            status: 'completed',
            sort: 'watch_score',
            order: 'asc',
            view: 'table',
        },
    },
    {
        name: 'anime, all statuses with every filter',
        type: 'anime',
        raw: {
            status: 'all',
            sort: 'score',
            order: 'desc',
            types: ['tv', 'movie'],
            statuses: 'ongoing',
            seasons: ['fall'],
            ratings: ['pg_13'],
            years: ['2000', '2020'],
            genres: ['action', '-ecchi'],
            studios: 'sunrise',
            score: ['7', '10'],
            magazines: ['ignored'],
        },
    },
    {
        name: 'anime, empty score',
        type: 'anime',
        raw: { status: 'on_hold', sort: 'watch_created', score: [] },
    },
    { name: 'manga, no search', type: 'manga', raw: {} },
    {
        name: 'manga, default search',
        type: 'manga',
        raw: { status: 'completed', sort: 'read_score' },
    },
    {
        name: 'manga, all statuses with every filter',
        type: 'manga',
        raw: {
            status: 'all',
            sort: 'read_chapters',
            order: 'asc',
            types: ['manga', 'manhwa'],
            statuses: ['finished'],
            years: ['1990', '2010'],
            genres: 'romance',
            magazines: ['shonen-jump'],
            score: ['5', '9'],
            seasons: ['ignored'],
            studios: ['ignored'],
            page: '3',
        },
    },
    {
        name: 'novel, default search',
        type: 'novel',
        raw: { status: 'completed', sort: 'read_score' },
    },
    {
        name: 'novel, reading with filters',
        type: 'novel',
        raw: {
            status: 'reading',
            sort: 'read_created',
            types: ['light_novel'],
            genres: ['fantasy'],
            view: 'grid',
            page: '2',
        },
    },
];

const PREFETCHED_LIST_CASES = LIST_CASES.filter(
    ({ raw }) => 'status' in raw && 'sort' in raw,
);

const EXPECTED_LIST_CALLS: Record<string, string[]> = {
    'anime, no search': [
        'redirect {"to":"/u/$username/list/$content_type","params":{"username":"tester","content_type":"anime"},"search":{"status":"completed","sort":"watch_score"},"statusCode":307}',
    ],
    'anime, status only': [
        'redirect {"to":"/u/$username/list/$content_type","params":{"username":"tester","content_type":"anime"},"search":{"status":"watching","sort":"watch_score"},"statusCode":307}',
    ],
    'anime, default search': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"completed","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_score:desc"]},"path":{"username":"tester"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    ],
    'anime, page 2': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"completed","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_score:desc"]},"path":{"username":"tester"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    ],
    'anime, table view ascending': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"completed","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_score:asc"]},"path":{"username":"tester"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    ],
    'anime, all statuses with every filter': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"<undefined>","media_type":["tv","movie"],"status":["ongoing"],"season":["fall"],"rating":["pg_13"],"years":[2000,2020],"genres":["action","-ecchi"],"studios":["sunrise"],"score":[7,10],"sort":["score:desc","scored_by:desc"]},"path":{"username":"tester"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    ],
    'anime, empty score': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"on_hold","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_created:desc"]},"path":{"username":"tester"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    ],
    'manga, no search': [
        'redirect {"to":"/u/$username/list/$content_type","params":{"username":"tester","content_type":"manga"},"search":{"status":"completed","sort":"read_score"},"statusCode":307}',
    ],
    'manga, default search': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"completed","media_type":[],"status":[],"years":[],"genres":[],"magazines":[],"score":"<undefined>","sort":["read_score:desc"]},"path":{"username":"tester","content_type":"manga"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"username":"tester","content_type":"manga"}}]',
    ],
    'manga, all statuses with every filter': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"<undefined>","media_type":["manga","manhwa"],"status":["finished"],"years":[1990,2010],"genres":["romance"],"magazines":["shonen-jump"],"score":[5,9],"sort":["read_chapters:asc"]},"path":{"username":"tester","content_type":"manga"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"username":"tester","content_type":"manga"}}]',
    ],
    'novel, default search': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"completed","media_type":[],"status":[],"years":[],"genres":[],"magazines":[],"score":"<undefined>","sort":["read_score:desc"]},"path":{"username":"tester","content_type":"novel"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"username":"tester","content_type":"novel"}}]',
    ],
    'novel, reading with filters': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"reading","media_type":["light_novel"],"status":[],"years":[],"genres":["fantasy"],"magazines":[],"score":"<undefined>","sort":["read_created:desc"]},"path":{"username":"tester","content_type":"novel"}}]',
        'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"username":"tester","content_type":"novel"}}]',
    ],
};

const EXPECTED_PROFILE_CALLS = [
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"serviceUserStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"serviceUserActivity","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"favouriteList","baseUrl":"https://api.example.test","_infinite":true,"path":{"username":"tester","content_type":"anime"},"query":{"size":6}}]',
    'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userHistory","baseUrl":"https://api.example.test","_infinite":true,"path":{"username":"tester"},"query":{"size":3}}]',
    'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"author":"tester"},"query":{"size":3}}]',
];

const EXPECTED_LAYOUT_CALLS = [
    'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"userProfile","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"followStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
];

const favouritesCalls = (method: string, type: string) => [
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"serviceUserStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    `${method} queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"favouriteList","baseUrl":"https://api.example.test","_infinite":true,"path":{"username":"tester","content_type":"${type}"}}]`,
];

function queryId(options: RecordedOptions) {
    return (options.queryKey[0] as { _id: string })._id;
}

function pendingQueryClient() {
    const queryClient = new QueryClient();
    const calls: string[] = [];
    const pending = (options: RecordedOptions) => {
        calls.push(queryId(options));
        return new Promise(() => {});
    };

    Object.assign(queryClient, {
        ensureQueryData: pending,
        ensureInfiniteQueryData: pending,
        prefetchQuery: pending,
        prefetchInfiniteQuery: pending,
    });

    return { queryClient, calls };
}

async function settlesWithin(promise: Promise<unknown>, ms = 20) {
    return Promise.race([
        promise.then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), ms)),
    ]);
}

describe('user layout loader', () => {
    it('requests only the profile and the follow stats', async () => {
        const calls = await runLoader(LayoutRoute, { username });

        expect(calls).toEqual(EXPECTED_LAYOUT_CALLS);
    });

    it('starts the follow stats before the profile resolves', async () => {
        let release: (value: unknown) => void = () => {};
        const profile = new Promise((resolve) => {
            release = resolve;
        });
        const calls: string[] = [];
        const queryClient = new QueryClient();
        Object.assign(queryClient, {
            ensureQueryData: (options: RecordedOptions) => {
                calls.push(queryId(options));
                return profile;
            },
            prefetchQuery: (options: RecordedOptions) => {
                calls.push(queryId(options));
                return Promise.resolve();
            },
        });
        const loader = LayoutRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        const result = loader({
            params: { username },
            context: { queryClient, apiClient: ssrRequestClient() },
        });
        await Promise.resolve();

        expect(calls).toEqual(['userProfile', 'followStats']);

        release({ username });
        await expect(result).resolves.toEqual({ user: { username } });
    });

    it('retries the profile after a cancel', async () => {
        const calls: string[] = [];
        const queryClient = new QueryClient();
        Object.assign(queryClient, {
            ensureQueryData: async (options: RecordedOptions) => {
                calls.push(queryId(options));
                if (calls.length === 1) throw new CancelledError();
                return { username };
            },
            prefetchQuery: async (options: RecordedOptions) => {
                calls.push(queryId(options));
            },
        });
        const loader = LayoutRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        await expect(
            loader({
                params: { username },
                context: { queryClient, apiClient: ssrRequestClient() },
            }),
        ).resolves.toEqual({ user: { username } });
        expect(calls).toEqual(['userProfile', 'followStats', 'userProfile']);
    });

    it.each([
        ['0b7c7ef2-6f7a-4a8e-9f7e-2a8d2f3c9b10', ['userReference'], true],
        [username, [], false],
    ] as const)(
        'redirects a user reference from beforeLoad: %s',
        async (param, expected, redirects) => {
            const calls: string[] = [];
            const queryClient = new QueryClient();
            Object.assign(queryClient, {
                ensureQueryData: async (options: RecordedOptions) => {
                    calls.push(queryId(options));
                    return { username };
                },
                prefetchQuery: async (options: RecordedOptions) => {
                    calls.push(queryId(options));
                },
            });
            const beforeLoad = LayoutRoute.options.beforeLoad as (
                ctx: unknown,
            ) => Promise<unknown>;

            const error = await beforeLoad({
                params: { username: param },
                context: { queryClient, apiClient: ssrRequestClient() },
            }).catch((thrown: unknown) => thrown);

            expect(isRedirect(error)).toBe(redirects);
            if (redirects) {
                expect(
                    (error as { options: { params: object } }).options.params,
                ).toEqual({ username });
            }
            expect(calls).toEqual(expected);
        },
    );
});

describe('profile sub-route loaders', () => {
    it('has no loader on the history page', () => {
        expect(HistoryRoute.options.loader).toBeUndefined();
    });

    it.each([
        [undefined, 'anime'],
        ['manga', 'manga'],
        ['collection', 'collection'],
    ])(
        'awaits the stats and the %s favourites on the server',
        async (type, expected) => {
            const calls = await runLoader(
                FavoritesRoute,
                { username },
                {
                    type,
                },
            );

            expect(calls).toEqual(
                favouritesCalls('prefetchInfiniteQuery', expected),
            );
        },
    );

    it('waits for the favourites on the server', async () => {
        vi.stubGlobal('window', undefined);
        const { queryClient, calls } = pendingQueryClient();
        const loader = FavoritesRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        const settled = await settlesWithin(
            loader({
                params: { username },
                deps: { type: 'novel' },
                context: { queryClient, apiClient: ssrRequestClient() },
            }),
        );

        expect(settled).toBe(false);
        expect(calls).toEqual(['serviceUserStats', 'favouriteList']);
    });

    it('keys the favourites loader on the type only', () => {
        const loaderDeps = FavoritesRoute.options.loaderDeps as (ctx: {
            search: unknown;
        }) => unknown;

        expect(loaderDeps({ search: { type: 'manga' } })).toEqual({
            type: 'manga',
        });
        expect(loaderDeps({ search: {} })).toEqual({ type: undefined });
    });

    it('prefetches the favourites on the client without waiting', async () => {
        const { queryClient, calls } = pendingQueryClient();
        const loader = FavoritesRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        const settled = await settlesWithin(
            loader({
                params: { username },
                deps: { type: 'novel' },
                context: { queryClient, apiClient: ssrRequestClient() },
            }),
        );

        expect(settled).toBe(true);
        expect(calls).toEqual(['serviceUserStats', 'favouriteList']);
    });

    it('prefetches the favourites on the client with prefetch calls', async () => {
        const calls = await runLoader(
            FavoritesRoute,
            { username },
            { type: 'person' },
            'client',
        );

        expect(calls).toEqual(
            favouritesCalls('prefetchInfiniteQuery', 'person'),
        );
    });
});

describe('user list loader', () => {
    it.each(LIST_CASES)(
        'keeps the HEAD calls: $name',
        async ({ name, type, raw }) => {
            const calls = await runLoader(
                ListRoute,
                { username, content_type: type },
                userlistSearchSchema.parse(raw),
            );

            expect(calls).toEqual(EXPECTED_LIST_CALLS[name]);
        },
    );

    it.each(
        LIST_CASES.filter(({ name }) =>
            EXPECTED_LIST_CALLS[name][0].startsWith('redirect'),
        ),
    )('redirects only from beforeLoad: $name', async ({ type, raw }) => {
        const { queryClient, calls } = recordingQueryClient();
        const loader = ListRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;
        await loader({
            params: { username, content_type: type },
            deps: userlistSearchSchema.parse(raw),
            context: { queryClient, apiClient: ssrRequestClient() },
        });

        expect(calls.some((call) => call.startsWith('redirect'))).toBe(false);
    });

    it('ignores the page param', () => {
        expect(EXPECTED_LIST_CALLS['anime, page 2']).toEqual(
            EXPECTED_LIST_CALLS['anime, default search'],
        );
    });

    it.each(PREFETCHED_LIST_CASES)(
        'issues the same calls on the client: $name',
        async ({ name, type, raw }) => {
            const calls = await runLoader(
                ListRoute,
                { username, content_type: type },
                userlistSearchSchema.parse(raw),
                'client',
            );

            expect(calls).toEqual(EXPECTED_LIST_CALLS[name]);
        },
    );

    it.each([
        ['anime', ['userWatchList', 'userWatchStats']],
        ['manga', ['userReadList', 'userReadStats']],
        ['novel', ['userReadList', 'userReadStats']],
    ])(
        'does not wait for the %s list on the client',
        async (type, expected) => {
            const { queryClient, calls } = pendingQueryClient();
            const loader = ListRoute.options.loader as (
                ctx: unknown,
            ) => Promise<unknown>;

            const settled = await settlesWithin(
                loader({
                    params: { username, content_type: type },
                    deps: userlistSearchSchema.parse({
                        status: 'completed',
                        sort: type === 'anime' ? 'watch_score' : 'read_score',
                    }),
                    context: { queryClient, apiClient: ssrRequestClient() },
                }),
            );

            expect(settled).toBe(true);
            expect(calls).toEqual(expected);
        },
    );

    it('waits for the list on the server', async () => {
        vi.stubGlobal('window', undefined);
        const { queryClient, calls } = pendingQueryClient();
        const loader = ListRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        const settled = await settlesWithin(
            loader({
                params: { username, content_type: 'anime' },
                deps: userlistSearchSchema.parse({
                    status: 'completed',
                    sort: 'watch_score',
                }),
                context: { queryClient, apiClient: ssrRequestClient() },
            }),
        );

        expect(settled).toBe(false);
        expect(calls).toEqual(['userWatchList', 'userWatchStats']);
    });
});

describe('profile loader', () => {
    it('requests the sized previews and the rendered stats', async () => {
        const calls = await runLoader(ProfileRoute, { username });

        expect(calls).toEqual(EXPECTED_PROFILE_CALLS);
    });

    it('leaves the collections and the read stats to the client', async () => {
        const calls = await runLoader(ProfileRoute, { username });

        expect(calls.some((call) => call.includes('getCollections'))).toBe(
            false,
        );
        expect(calls.some((call) => call.includes('userReadStats'))).toBe(
            false,
        );
    });

    it('leaves a cancelled preview to the component', async () => {
        const calls: string[] = [];
        const queryClient = new QueryClient();
        Object.assign(queryClient, {
            fetchInfiniteQuery: async (options: RecordedOptions) => {
                calls.push(queryId(options));
                throw new CancelledError();
            },
            prefetchQuery: async () => {},
        });
        const loader = ProfileRoute.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        await expect(
            loader({
                params: { username },
                context: { queryClient, apiClient: ssrRequestClient() },
            }),
        ).resolves.toBeUndefined();

        expect([...calls].sort()).toEqual([
            'favouriteList',
            'getArticles',
            'userHistory',
        ]);
    });
});

describe('list hooks', () => {
    const HOOK_SEARCHES = [
        { name: 'no status', raw: {} },
        ...PREFETCHED_LIST_CASES.map(({ name, raw }) => ({ name, raw })),
    ];

    it.each(HOOK_SEARCHES)(
        'useUserList passes the HEAD anime options: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            mocks.params = { username, content_type: 'anime' };
            mocks.search = search;

            useUserList('anime');

            const [[options, extra]] = mocks.infiniteListCalls as [
                [CapturedOptions, unknown],
            ];
            const head = headUseWatchListOptions(search, mocks.params).queryKey;

            expect(mocks.infiniteListCalls).toHaveLength(1);
            expect(options.queryKey).toStrictEqual(head);
            expect(hashKey(options.queryKey)).toBe(hashKey(head));
            expect(extra).toBeUndefined();
        },
    );

    it.each(
        HOOK_SEARCHES.flatMap((search) => [
            { ...search, type: 'manga' as const },
            { ...search, type: 'novel' as const },
        ]),
    )(
        'useUserList passes the HEAD read options: $type, $name',
        ({ raw, type }) => {
            const search = userlistSearchSchema.parse(raw);
            mocks.params = { username, content_type: type };
            mocks.search = search;

            useUserList(type);

            const [[options, extra]] = mocks.infiniteListCalls as [
                [CapturedOptions, unknown],
            ];
            const head = headUseReadListOptions(search, mocks.params).queryKey;

            expect(mocks.infiniteListCalls).toHaveLength(1);
            expect(options.queryKey).toStrictEqual(head);
            expect(hashKey(options.queryKey)).toBe(hashKey(head));
            expect(extra).toBeUndefined();
        },
    );
});

describe('profile previews', () => {
    it('UserArticles queries the HEAD options', () => {
        mocks.params = { username };
        mocks.list = [];

        expect(renderToStaticMarkup(createElement(UserArticles))).toBe('');

        const [[options]] = mocks.infiniteListCalls as [[CapturedOptions]];
        expect(options.queryKey).toStrictEqual(
            headUserArticlesOptions(mocks.params).queryKey,
        );
    });

    it.each([false, true])(
        'UserCollections queries the sized preview when visible is %s',
        (visible) => {
            mocks.params = { username };
            mocks.visible = visible;

            renderToStaticMarkup(createElement(UserCollections, {}));

            const [[options, extra]] = mocks.infiniteListCalls as [
                [CapturedOptions, unknown],
            ];
            expect(options.queryKey).toStrictEqual(
                userCollectionsOptions(username, { preview: true }).queryKey,
            );
            expect(extra).toStrictEqual({ enabled: visible });
        },
    );

    it('UserCollections renders a skeleton until the preview loads', () => {
        mocks.params = { username };

        const html = renderToStaticMarkup(createElement(UserCollections, {}));

        expect(html).toContain('id="user-collections"');
        expect(html).toContain('Колекції');
        expect(html.match(/animate-pulse/g)?.length).toBeGreaterThan(0);
    });

    it('UserCollections hides an empty preview from visitors', () => {
        mocks.params = { username };
        mocks.list = [];

        expect(renderToStaticMarkup(createElement(UserCollections, {}))).toBe(
            '<div></div>',
        );
    });

    it('UserHistory queries the sized preview', () => {
        mocks.params = { username };
        mocks.list = [];

        renderToStaticMarkup(createElement(UserHistory, {}));

        const [[options]] = mocks.infiniteListCalls as [[CapturedOptions]];
        expect(options.queryKey).toStrictEqual(
            userHistoryPreviewOptions(username).queryKey,
        );
    });

    it('HistoryModal keeps the unsized history key', () => {
        mocks.params = { username };
        mocks.list = [];

        renderToStaticMarkup(createElement(HistoryModal));

        const [[options]] = mocks.infiniteListCalls as [[CapturedOptions]];
        expect(options.queryKey).toStrictEqual(
            userHistoryInfiniteOptions({ path: { username } }).queryKey,
        );
    });

    it.each([
        [false, 'preview'],
        [true, 'list'],
    ])('FavoriteSection extended=%s queries the %s key', (extended) => {
        mocks.params = { username };
        mocks.list = [];
        const type = 'manga' as FavouriteContentTypeEnum;

        renderToStaticMarkup(
            createElement(FavoriteSection, { type, extended }),
        );

        const [[options, extra]] = mocks.infiniteListCalls as [
            [CapturedOptions, unknown],
        ];
        expect(options.queryKey).toStrictEqual(
            extended
                ? userFavouritesOptions(username, type).queryKey
                : userFavouritesOptions(username, type, { preview: true })
                      .queryKey,
        );
        expect(extra).toBeUndefined();
    });
});

const WATCH_SEARCHES = [
    { name: 'no status', raw: {} },
    ...PREFETCHED_LIST_CASES.filter(({ type }) => type === 'anime'),
];

const READ_SEARCHES = [
    { name: 'no status', raw: {} },
    ...PREFETCHED_LIST_CASES.filter(({ type }) => type !== 'anime'),
];

describe('userListOptions (anime)', () => {
    it.each(WATCH_SEARCHES)(
        'equals the HEAD component key: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            const params = { username, content_type: 'anime' };
            const component = userListOptions(
                username,
                'anime',
                search,
            ).queryKey;
            const head = headUseWatchListOptions(search, params).queryKey;

            expect(component).toStrictEqual(head);
            expect(hashKey(component)).toBe(hashKey(head));
        },
    );

    it.each(WATCH_SEARCHES)(
        'keys the loader like the component: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            const loader = userListOptions(
                username,
                'anime',
                search,
                ssrRequestClient(),
            ).queryKey;
            const component = userListOptions(
                username,
                'anime',
                search,
            ).queryKey;

            expect(loader).toStrictEqual(component);
            expect(hashKey(loader)).toBe(hashKey(component));
        },
    );

    it('leaves the page out of the key', () => {
        const pageOne = userlistSearchSchema.parse({
            status: 'completed',
            sort: 'watch_score',
        });
        const pageTwo = userlistSearchSchema.parse({
            status: 'completed',
            sort: 'watch_score',
            page: '2',
        });

        expect(pageTwo.page).toBe(2);
        expect(
            userListOptions(username, 'anime', pageTwo).queryKey,
        ).toStrictEqual(userListOptions(username, 'anime', pageOne).queryKey);
    });

    it.each([
        ['status', { status: 'watching' }],
        ['order', { order: 'asc' }],
        ['sort', { sort: 'score' }],
        ['genres', { genres: ['action'] }],
        ['score', { score: ['7', '10'] }],
    ] as const)('hashes a different %s differently', (_, change) => {
        const base = { status: 'completed', sort: 'watch_score' };
        const baseKey = userListOptions(
            username,
            'anime',
            userlistSearchSchema.parse(base),
        ).queryKey;
        const changedKey = userListOptions(
            username,
            'anime',
            userlistSearchSchema.parse({ ...base, ...change }),
        ).queryKey;

        expect(hashKey(changedKey)).not.toBe(hashKey(baseKey));
    });

    it('sends the component request from the loader', async () => {
        const search = userlistSearchSchema.parse(
            LIST_CASES.find(
                ({ name }) => name === 'anime, all statuses with every filter',
            )?.raw,
        );
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userListOptions(username, 'anime', search, client),
            client,
        );
        const fromComponent = await sentRequest(
            headUseWatchListOptions(search, { username }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader.path).toBe(`/watch/${username}/list?page=1`);
        expect(fromLoader).toEqual(fromComponent);
    });
});

describe('userListOptions (manga, novel)', () => {
    it.each(
        READ_SEARCHES.flatMap((search) => [
            { ...search, contentType: 'manga' as ReadContentTypeEnum },
            { ...search, contentType: 'novel' as ReadContentTypeEnum },
        ]),
    )(
        'equals the HEAD component key: $contentType, $name',
        ({ raw, contentType }) => {
            const search = userlistSearchSchema.parse(raw);
            const params = { username, content_type: contentType };
            const component = userListOptions(
                username,
                contentType,
                search,
            ).queryKey;
            const loader = userListOptions(
                username,
                contentType,
                search,
                ssrRequestClient(),
            ).queryKey;
            const head = headUseReadListOptions(search, params).queryKey;

            expect(component).toStrictEqual(head);
            expect(hashKey(component)).toBe(hashKey(head));
            expect(loader).toStrictEqual(component);
            expect(hashKey(loader)).toBe(hashKey(component));
        },
    );

    it('hashes manga and novel differently', () => {
        const search = userlistSearchSchema.parse({
            status: 'completed',
            sort: 'read_score',
        });

        expect(
            hashKey(
                userListOptions(
                    username,
                    'manga' as ReadContentTypeEnum,
                    search,
                ).queryKey,
            ),
        ).not.toBe(
            hashKey(
                userListOptions(
                    username,
                    'novel' as ReadContentTypeEnum,
                    search,
                ).queryKey,
            ),
        );
    });

    it('hashes a different status differently', () => {
        const base = { status: 'completed', sort: 'read_score' };
        const contentType = 'manga' as ReadContentTypeEnum;

        expect(
            hashKey(
                userListOptions(
                    username,
                    contentType,
                    userlistSearchSchema.parse(base),
                ).queryKey,
            ),
        ).not.toBe(
            hashKey(
                userListOptions(
                    username,
                    contentType,
                    userlistSearchSchema.parse({ ...base, status: 'reading' }),
                ).queryKey,
            ),
        );
    });

    it('sends the component request from the loader', async () => {
        const search = userlistSearchSchema.parse(
            LIST_CASES.find(
                ({ name }) => name === 'manga, all statuses with every filter',
            )?.raw,
        );
        const contentType = 'manga' as ReadContentTypeEnum;
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userListOptions(username, contentType, search, client),
            client,
        );
        const fromComponent = await sentRequest(
            headUseReadListOptions(search, {
                username,
                content_type: contentType,
            }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader.path).toBe(`/read/manga/${username}/list?page=1`);
        expect(fromLoader).toEqual(fromComponent);
    });
});

describe('userArticlesPreviewOptions', () => {
    it('equals the HEAD component key on both sides', () => {
        const head = headUserArticlesOptions({ username }).queryKey;
        const component = userArticlesPreviewOptions(username).queryKey;
        const loader = userArticlesPreviewOptions(
            username,
            ssrRequestClient(),
        ).queryKey;

        expect(component).toStrictEqual(head);
        expect(loader).toStrictEqual(head);
        expect(hashKey(loader)).toBe(hashKey(head));
    });

    it('hashes another author differently', () => {
        expect(
            hashKey(userArticlesPreviewOptions('someone-else').queryKey),
        ).not.toBe(hashKey(userArticlesPreviewOptions(username).queryKey));
    });

    it('sends the component request from the loader', async () => {
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userArticlesPreviewOptions(username, client),
            client,
        );
        const fromComponent = await sentRequest(
            headUserArticlesOptions({ username }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader).toEqual(fromComponent);
        expect(JSON.parse(fromLoader.body)).toEqual({ author: username });
    });
});

describe('userCollectionsOptions', () => {
    it('keys the modal list like HEAD', () => {
        expect(userCollectionsOptions(username).queryKey).toStrictEqual(
            headUserCollectionsOptions({ username }).queryKey,
        );
    });

    it('keys the modal loader like the component', () => {
        expect(
            hashKey(
                userCollectionsOptions(username, {}, ssrRequestClient())
                    .queryKey,
            ),
        ).toBe(hashKey(userCollectionsOptions(username).queryKey));
    });

    it('adds the preview size to the HEAD key', () => {
        expect(
            userCollectionsOptions(username, { preview: true }).queryKey,
        ).toStrictEqual(
            getCollectionsInfiniteOptions({
                body: headUserCollectionsBody({ username }),
                query: { size: 3 },
            }).queryKey,
        );
    });

    it('keys the loader like the component', () => {
        const component = userCollectionsOptions(username, {
            preview: true,
        }).queryKey;
        const loader = userCollectionsOptions(
            username,
            { preview: true },
            ssrRequestClient(),
        ).queryKey;

        expect(loader).toStrictEqual(component);
        expect(hashKey(loader)).toBe(hashKey(component));
    });

    it('keeps the collection list modal on its own unsized key', () => {
        expect(
            hashKey(headUserCollectionsOptions({ username }).queryKey),
        ).not.toBe(
            hashKey(
                userCollectionsOptions(username, { preview: true }).queryKey,
            ),
        );
    });

    it('hashes a public-only body differently', () => {
        expect(
            hashKey(
                getCollectionsInfiniteOptions({
                    body: {
                        ...headUserCollectionsBody({ username }),
                        only_public: true,
                    },
                    query: { size: 3 },
                }).queryKey,
            ),
        ).not.toBe(
            hashKey(
                userCollectionsOptions(username, { preview: true }).queryKey,
            ),
        );
    });

    it('sends the component request from the loader', async () => {
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userCollectionsOptions(username, { preview: true }, client),
            client,
        );
        const fromComponent = await sentRequest(
            userCollectionsOptions(username, { preview: true }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader.path).toBe('/collections?size=3&page=1');
        expect(fromLoader).toEqual(fromComponent);
        expect(JSON.parse(fromLoader.body)).toEqual(
            headUserCollectionsBody({ username }),
        );
    });
});

describe('userHistoryPreviewOptions', () => {
    it('adds size 3 to the HEAD history key', () => {
        expect(userHistoryPreviewOptions(username).queryKey).toStrictEqual(
            userHistoryInfiniteOptions({
                path: { username },
                query: { size: 3 },
            }).queryKey,
        );
    });

    it('keys the loader like the component', () => {
        const component = userHistoryPreviewOptions(username).queryKey;
        const loader = userHistoryPreviewOptions(
            username,
            ssrRequestClient(),
        ).queryKey;

        expect(loader).toStrictEqual(component);
        expect(hashKey(loader)).toBe(hashKey(component));
    });

    it('keeps the modal and the history page on the unsized key', () => {
        expect(
            hashKey(
                userHistoryInfiniteOptions({ path: { username } }).queryKey,
            ),
        ).not.toBe(hashKey(userHistoryPreviewOptions(username).queryKey));
    });

    it('sends the component request from the loader', async () => {
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userHistoryPreviewOptions(username, client),
            client,
        );
        const fromComponent = await sentRequest(
            userHistoryPreviewOptions(username),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('GET');
        expect(fromLoader.path).toBe(`/history/user/${username}?size=3&page=1`);
        expect(fromLoader).toEqual(fromComponent);
    });
});

describe('userFavouritesOptions', () => {
    it('sizes the preview to the collapsed stack', () => {
        expect(FAVOURITES_PREVIEW_SIZE).toBe(6);
        expect(
            userFavouritesOptions(
                username,
                'anime' as FavouriteContentTypeEnum,
                { preview: true },
            ).queryKey,
        ).toStrictEqual(
            favouriteListInfiniteOptions({
                path: {
                    username,
                    content_type: 'anime' as FavouriteContentTypeEnum,
                },
                query: { size: 6 },
            }).queryKey,
        );
    });

    it.each(['anime', 'manga', 'novel', 'character', 'person', 'collection'])(
        'keys the %s loader like the component for the preview and the list',
        (type) => {
            const contentType = type as FavouriteContentTypeEnum;
            for (const preview of [true, false]) {
                const component = userFavouritesOptions(username, contentType, {
                    preview,
                }).queryKey;
                const loader = userFavouritesOptions(
                    username,
                    contentType,
                    { preview },
                    ssrRequestClient(),
                ).queryKey;

                expect(loader).toStrictEqual(component);
                expect(hashKey(loader)).toBe(hashKey(component));
            }
        },
    );

    it('keeps the favorites page on the HEAD unsized key', () => {
        const contentType = 'character' as FavouriteContentTypeEnum;
        const head = favouriteListInfiniteOptions({
            path: { content_type: contentType, username },
        }).queryKey;

        expect(
            userFavouritesOptions(username, contentType).queryKey,
        ).toStrictEqual(head);
        expect(hashKey(head)).not.toBe(
            hashKey(
                userFavouritesOptions(username, contentType, { preview: true })
                    .queryKey,
            ),
        );
    });

    it('sends the component request from the loader', async () => {
        const contentType = 'anime' as FavouriteContentTypeEnum;
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userFavouritesOptions(
                username,
                contentType,
                { preview: true },
                client,
            ),
            client,
        );
        const fromComponent = await sentRequest(
            userFavouritesOptions(username, contentType, { preview: true }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader.path).toBe(
            `/favourite/anime/${username}/list?size=6&page=1`,
        );
        expect(fromLoader).toEqual(fromComponent);
    });
});
