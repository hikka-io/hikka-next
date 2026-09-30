import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type Client,
    type CollectionsListArgs,
    type ContentStatusEnum,
    configureBrowserClient,
    createRequestClient,
    getArticlesInfiniteOptions,
    getBrowserClient,
    getCollectionsInfiniteOptions,
    type MangaMediaEnum,
    type NovelMediaEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import {
    type UserlistSearch,
    userlistSearchSchema,
} from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

import { Route as ProfileRoute } from '../../routes/_pages/u/$username/index';
import { Route as ListRoute } from '../../routes/_pages/u/$username/list/$content_type';
import { useReadList } from './list/use-read-list';
import { useWatchList } from './list/use-watch-list';
import UserArticles from './profile/user-articles';
import UserCollections from './profile/user-collections';
import {
    userArticlesPreviewOptions,
    userCollectionsPreviewBody,
    userCollectionsPreviewOptions,
    userReadListOptions,
    userWatchListOptions,
} from './queries';

const mocks = vi.hoisted(() => ({
    params: {} as Record<string, string>,
    search: {} as Record<string, unknown>,
    list: undefined as unknown[] | undefined,
    infiniteListCalls: [] as unknown[][],
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useParams: () => mocks.params,
    useRouteSearch: () => mocks.search,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.infiniteListCalls.push(args);
        return { list: mocks.list };
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

const BASE_URL = 'https://api.example.test';
const username = 'tester';

type LoaderRoute = { options: { loader?: unknown } };

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
) {
    const { queryClient, calls } = recordingQueryClient();
    const loader = route.options.loader as (ctx: unknown) => Promise<unknown>;
    try {
        await loader({
            params,
            deps,
            context: { queryClient, apiClient: ssrRequestClient() },
        });
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
    ],
    'anime, page 2': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"completed","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_score:desc"]},"path":{"username":"tester"}}]',
    ],
    'anime, table view ascending': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"completed","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_score:asc"]},"path":{"username":"tester"}}]',
    ],
    'anime, all statuses with every filter': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"<undefined>","media_type":["tv","movie"],"status":["ongoing"],"season":["fall"],"rating":["pg_13"],"years":[2000,2020],"genres":["action","-ecchi"],"studios":["sunrise"],"score":[7,10],"sort":["score:desc","scored_by:desc"]},"path":{"username":"tester"}}]',
    ],
    'anime, empty score': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"on_hold","media_type":[],"status":[],"season":[],"rating":[],"years":[],"genres":[],"studios":[],"score":"<undefined>","sort":["watch_created:desc"]},"path":{"username":"tester"}}]',
    ],
    'manga, no search': [
        'redirect {"to":"/u/$username/list/$content_type","params":{"username":"tester","content_type":"manga"},"search":{"status":"completed","sort":"read_score"},"statusCode":307}',
    ],
    'manga, default search': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"completed","media_type":[],"status":[],"years":[],"genres":[],"magazines":[],"score":"<undefined>","sort":["read_score:desc"]},"path":{"username":"tester","content_type":"manga"}}]',
    ],
    'manga, all statuses with every filter': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"<undefined>","media_type":["manga","manhwa"],"status":["finished"],"years":[1990,2010],"genres":["romance"],"magazines":["shonen-jump"],"score":[5,9],"sort":["read_chapters:asc"]},"path":{"username":"tester","content_type":"manga"}}]',
    ],
    'novel, default search': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"completed","media_type":[],"status":[],"years":[],"genres":[],"magazines":[],"score":"<undefined>","sort":["read_score:desc"]},"path":{"username":"tester","content_type":"novel"}}]',
    ],
    'novel, reading with filters': [
        'prefetchInfiniteQuery queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userReadList","baseUrl":"https://api.example.test","_infinite":true,"body":{"read_status":"reading","media_type":["light_novel"],"status":[],"years":[],"genres":["fantasy"],"magazines":[],"score":"<undefined>","sort":["read_created:desc"]},"path":{"username":"tester","content_type":"novel"}}]',
    ],
};

const EXPECTED_PROFILE_CALLS = [
    'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"favouriteList","baseUrl":"https://api.example.test","_infinite":true,"path":{"username":"tester","content_type":"anime"}}]',
    'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userHistory","baseUrl":"https://api.example.test","_infinite":true,"path":{"username":"tester"}}]',
    'prefetchQuery queryFn,queryKey "<undefined>" [{"_id":"serviceUserActivity","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
    'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"author":"tester"},"query":{"size":3}}]',
    'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getCollections","baseUrl":"https://api.example.test","_infinite":true,"body":{"author":"tester","sort":["created:desc"],"only_public":false}}]',
];

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

    it('ignores the page param', () => {
        expect(EXPECTED_LIST_CALLS['anime, page 2']).toEqual(
            EXPECTED_LIST_CALLS['anime, default search'],
        );
    });
});

describe('profile loader', () => {
    it('keeps the HEAD calls in order', async () => {
        const calls = await runLoader(ProfileRoute, { username });

        expect(calls).toEqual(EXPECTED_PROFILE_CALLS);
    });
});

describe('list hooks', () => {
    const HOOK_SEARCHES = [
        { name: 'no status', raw: {} },
        ...PREFETCHED_LIST_CASES.map(({ name, raw }) => ({ name, raw })),
    ];

    it.each(HOOK_SEARCHES)(
        'useWatchList passes the HEAD options: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            mocks.params = { username, content_type: 'anime' };
            mocks.search = search;

            useWatchList({ enabled: true });
            useWatchList();

            const [[options, extra], [, noExtra]] = mocks.infiniteListCalls as [
                [CapturedOptions, unknown],
                [CapturedOptions, unknown],
            ];
            const head = headUseWatchListOptions(search, mocks.params).queryKey;

            expect(options.queryKey).toStrictEqual(head);
            expect(hashKey(options.queryKey)).toBe(hashKey(head));
            expect(extra).toStrictEqual({ enabled: true });
            expect(noExtra).toStrictEqual({ enabled: undefined });
        },
    );

    it.each(
        HOOK_SEARCHES.flatMap((search) => [
            { ...search, type: 'manga' },
            { ...search, type: 'novel' },
        ]),
    )('useReadList passes the HEAD options: $type, $name', ({ raw, type }) => {
        const search = userlistSearchSchema.parse(raw);
        mocks.params = { username, content_type: type };
        mocks.search = search;

        useReadList({ enabled: false });

        const [[options, extra]] = mocks.infiniteListCalls as [
            [CapturedOptions, unknown],
        ];
        const head = headUseReadListOptions(search, mocks.params).queryKey;

        expect(options.queryKey).toStrictEqual(head);
        expect(hashKey(options.queryKey)).toBe(hashKey(head));
        expect(extra).toStrictEqual({ enabled: false });
    });
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

    it('UserCollections queries the HEAD options', () => {
        mocks.params = { username };

        expect(renderToStaticMarkup(createElement(UserCollections, {}))).toBe(
            '',
        );

        const [[options]] = mocks.infiniteListCalls as [[CapturedOptions]];
        expect(options.queryKey).toStrictEqual(
            headUserCollectionsOptions(mocks.params).queryKey,
        );
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

describe('userWatchListOptions', () => {
    it.each(WATCH_SEARCHES)(
        'equals the HEAD component key: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            const params = { username, content_type: 'anime' };
            const component = userWatchListOptions(username, search).queryKey;
            const head = headUseWatchListOptions(search, params).queryKey;

            expect(component).toStrictEqual(head);
            expect(hashKey(component)).toBe(hashKey(head));
        },
    );

    it.each(WATCH_SEARCHES)(
        'keys the loader like the component: $name',
        ({ raw }) => {
            const search = userlistSearchSchema.parse(raw);
            const loader = userWatchListOptions(
                username,
                search,
                ssrRequestClient(),
            ).queryKey;
            const component = userWatchListOptions(username, search).queryKey;

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
        expect(userWatchListOptions(username, pageTwo).queryKey).toStrictEqual(
            userWatchListOptions(username, pageOne).queryKey,
        );
    });

    it.each([
        ['status', { status: 'watching' }],
        ['order', { order: 'asc' }],
        ['sort', { sort: 'score' }],
        ['genres', { genres: ['action'] }],
        ['score', { score: ['7', '10'] }],
    ] as const)('hashes a different %s differently', (_, change) => {
        const base = { status: 'completed', sort: 'watch_score' };
        const baseKey = userWatchListOptions(
            username,
            userlistSearchSchema.parse(base),
        ).queryKey;
        const changedKey = userWatchListOptions(
            username,
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
            userWatchListOptions(username, search, client),
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

describe('userReadListOptions', () => {
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
            const component = userReadListOptions(
                username,
                contentType,
                search,
            ).queryKey;
            const loader = userReadListOptions(
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
                userReadListOptions(
                    username,
                    'manga' as ReadContentTypeEnum,
                    search,
                ).queryKey,
            ),
        ).not.toBe(
            hashKey(
                userReadListOptions(
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
                userReadListOptions(
                    username,
                    contentType,
                    userlistSearchSchema.parse(base),
                ).queryKey,
            ),
        ).not.toBe(
            hashKey(
                userReadListOptions(
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
            userReadListOptions(username, contentType, search, client),
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

describe('userCollectionsPreviewOptions', () => {
    it('builds the HEAD body', () => {
        expect(userCollectionsPreviewBody(username)).toStrictEqual(
            headUserCollectionsBody({ username }),
        );
    });

    it('equals the HEAD component key on both sides', () => {
        const head = headUserCollectionsOptions({ username }).queryKey;
        const component = userCollectionsPreviewOptions(username).queryKey;
        const loader = userCollectionsPreviewOptions(
            username,
            ssrRequestClient(),
        ).queryKey;

        expect(component).toStrictEqual(head);
        expect(loader).toStrictEqual(head);
        expect(hashKey(loader)).toBe(hashKey(head));
    });

    it('shares the key with the collection list modal body', () => {
        expect(
            getCollectionsInfiniteOptions({
                body: userCollectionsPreviewBody(username),
            }).queryKey,
        ).toStrictEqual(userCollectionsPreviewOptions(username).queryKey);
    });

    it('hashes a public-only body differently', () => {
        expect(
            hashKey(
                getCollectionsInfiniteOptions({
                    body: {
                        ...userCollectionsPreviewBody(username),
                        only_public: true,
                    },
                }).queryKey,
            ),
        ).not.toBe(hashKey(userCollectionsPreviewOptions(username).queryKey));
    });

    it('sends the component request from the loader', async () => {
        const client = loaderRequestClient();
        const fromLoader = await sentRequest(
            userCollectionsPreviewOptions(username, client),
            client,
        );
        const fromComponent = await sentRequest(
            headUserCollectionsOptions({ username }),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader).toEqual(fromComponent);
        expect(JSON.parse(fromLoader.body)).toEqual(
            headUserCollectionsBody({ username }),
        );
    });
});
