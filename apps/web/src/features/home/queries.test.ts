import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
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
    AnimeMediaEnum,
    AnimeStatusEnum,
    type Client,
    configureBrowserClient,
    createRequestClient,
    type FeedArgs,
    FeedArticleCategoryEnum,
    FeedArticleContentTypeEnum,
    FeedCollectionContentTypeEnum,
    FeedCommentContentTypeEnum,
    FeedContentTypeEnum,
    getBrowserClient,
    getFeedInfiniteOptions,
    type ProfileResponse,
    paginationPageParam,
    profileQueryKey,
    profileUiQueryKey,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
    type UiFeedSettingsOutput,
    type UserCustomizationResponse,
} from '@hikka/api';

import { DEFAULT_USER_UI } from '@/utils/customization';
import { getCurrentSeason } from '@/utils/season';
import { getOngoingsSort } from '@/utils/sort';

import { Route as HomeRoute } from '../../routes/_pages/index';
import {
    buildFeedArgs,
    followingHistoryPreviewOptions,
    HOME_ARTICLES_NEWEST_SORT,
    HOME_ARTICLES_POPULAR_SORT,
    homeArticlesOptions,
    isFeedDisabled,
    ongoingsOptions,
} from './queries';
import type { UIFeedWidgetSide } from './types';
import ArticlesWidget from './widgets/articles-widget';
import CollectionsWidget from './widgets/collections-widget';
import FeedWidget from './widgets/feed-widget';
import HistoryWidget from './widgets/history-widget';
import OngoingsWidget from './widgets/ongoings-widget';

type FeedQuery = { queryKey: readonly unknown[]; enabled?: boolean };

const mocks = vi.hoisted(() => ({
    infiniteListCalls: [] as unknown[][],
    feedQueries: [] as FeedQuery[],
    visible: false,
    pending: false,
    user: undefined as ProfileResponse | undefined,
    ui: undefined as UserCustomizationResponse | undefined,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@tanstack/react-query')>()),
    useInfiniteQuery: (options: FeedQuery) => {
        mocks.feedQueries.push(options);
        return { data: undefined, isPending: true, hasNextPage: false };
    },
}));

vi.mock('@/services/hooks/use-back-close', () => ({ useBackClose: () => {} }));

vi.mock('@/services/hooks/use-visible', () => ({
    useVisible: () => ({ ref: () => {}, visible: mocks.visible }),
}));

vi.mock('@/services/hooks/use-visible-once', () => ({
    useVisibleOnce: () => ({ ref: () => {}, visible: mocks.visible }),
}));

vi.mock('@/services/session/use-session', () => ({
    useSession: () => ({ user: mocks.user }),
}));

vi.mock('@/services/session/use-update-session-ui', () => ({
    useUpdateSessionUI: () => ({ update: () => {} }),
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    Link: ({
        to,
        search,
        children,
    }: {
        to: string;
        search?: Record<string, unknown>;
        children?: ReactNode;
    }) =>
        createElement(
            'a',
            {
                href: search
                    ? `${to}?${new URLSearchParams(search as Record<string, string>)}`
                    : to,
            },
            children,
        ),
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.infiniteListCalls.push(args);
        return {
            list: mocks.pending ? undefined : [],
            isLoading: false,
            isPending: mocks.pending,
        };
    },
}));

vi.mock('@/services/session/use-session-ui', async (importOriginal) => ({
    ...(await importOriginal<
        typeof import('@/services/session/use-session-ui')
    >()),
    useSessionUI: () => ({
        preferences: {
            title_language: 'title_ua',
            name_language: 'name_ua',
            feed: {
                widgets: [],
                ...(mocks.ui ?? DEFAULT_USER_UI).preferences.feed,
            },
        },
    }),
}));

const BASE_URL = 'https://api.example.test';

const PROFILE: ProfileResponse = {
    reference: '7d2f6a4e-1c3b-4b8e-9f0a-5e6d7c8b9a01',
    updated: null,
    created: 1700000000,
    description: null,
    username: 'tester',
    cover: null,
    active: true,
    avatar: 'https://cdn.example.test/avatar.jpg',
    role: 'user',
    email: 'tester@example.test',
};

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

function ssrRequestClient(authToken?: string) {
    return createRequestClient({
        baseUrl: BASE_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken,
    });
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

const loaderOptions: RecordedOptions[] = [];

async function runHomeLoader(
    type: string | undefined,
    loggedIn: boolean,
    ui?: UserCustomizationResponse,
) {
    const queryClient = new QueryClient();
    const calls: string[] = [];

    if (loggedIn) queryClient.setQueryData(profileQueryKey(), PROFILE);
    if (ui) queryClient.setQueryData(profileUiQueryKey(), ui);

    const record = (method: string) => async (options: RecordedOptions) => {
        loaderOptions.push(options);
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

    const loader = HomeRoute.options.loader as unknown as (
        ctx: unknown,
    ) => Promise<unknown>;
    await loader({
        deps: { type },
        context: {
            queryClient,
            apiClient: ssrRequestClient(loggedIn ? 'token' : undefined),
        },
    });
    return calls;
}

const HEAD_SIDEBAR_SIZE = 5;
const HEAD_CENTER_SIZE = 5;

// Copy of the list query in HEAD ongoings-widget.tsx.
function headOngoingsWidgetOptions(side: UIFeedWidgetSide) {
    const currentSeason = getCurrentSeason() as SeasonEnum;
    const year = new Date().getFullYear();
    const isCenter = side === 'center';

    return searchAnimeInfiniteOptions({
        body: {
            season: [currentSeason],
            media_type: [AnimeMediaEnum.TV],
            years: [year, year],
            genres: ['-ecchi', '-hentai'],
            status: [AnimeStatusEnum.ONGOING],
            sort: getOngoingsSort(),
        },
        query: {
            size: isCenter ? HEAD_CENTER_SIZE : HEAD_SIDEBAR_SIZE,
        },
    });
}

function useFakeDate(date: string) {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(date));
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    mocks.infiniteListCalls = [];
    mocks.feedQueries = [];
    mocks.user = undefined;
    mocks.ui = undefined;
    mocks.visible = false;
    mocks.pending = false;
    loaderOptions.length = 0;
});

afterEach(() => {
    vi.useRealTimers();
});

const DATES = {
    september: '2026-09-29T12:00:00',
    newYear: '2027-01-01T08:00:00',
    spring: '2027-04-15T08:00:00',
};

const HOME_CASES = [
    {
        name: 'anonymous, september',
        date: DATES.september,
        type: undefined,
        loggedIn: false,
    },
    {
        name: 'anonymous, comments feed',
        date: DATES.september,
        type: 'comments',
        loggedIn: false,
    },
    {
        name: 'logged in, september',
        date: DATES.september,
        type: undefined,
        loggedIn: true,
    },
    {
        name: 'anonymous, new year',
        date: DATES.newYear,
        type: 'all',
        loggedIn: false,
    },
    {
        name: 'anonymous, spring',
        date: DATES.spring,
        type: 'articles',
        loggedIn: false,
    },
];

const EXPECTED_HOME_CALLS: Record<string, string[]> = {
    'anonymous, september': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"sort":["created:desc"]},"query":{"size":3}}]',
    ],
    'anonymous, comments feed': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"sort":["created:desc"]},"query":{"size":3}}]',
    ],
    'logged in, september': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"watching","sort":["watch_updated:desc"]},"path":{"username":"tester"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"followingHistory","baseUrl":"https://api.example.test","_infinite":true,"query":{"size":3}}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"followStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"sort":["created:desc"]},"query":{"size":3}}]',
    ],
    'anonymous, new year': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["fall",2027],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["fall"],"media_type":["tv"],"years":[2027,2027],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"sort":["created:desc"]},"query":{"size":3}}]',
    ],
    'anonymous, spring': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["spring",2027],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["spring"],"media_type":["tv"],"years":[2027,2027],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"getArticles","baseUrl":"https://api.example.test","_infinite":true,"body":{"sort":["created:desc"]},"query":{"size":3}}]',
    ],
};

describe('home loader', () => {
    it.each(HOME_CASES)(
        'makes the expected calls: $name',
        async ({ name, date, type, loggedIn }) => {
            useFakeDate(date);

            expect(await runHomeLoader(type, loggedIn)).toEqual(
                EXPECTED_HOME_CALLS[name],
            );
        },
    );
});

describe('OngoingsWidget', () => {
    it.each([
        ['center', DATES.september],
        ['left', DATES.september],
        ['right', DATES.newYear],
    ] as const)('queries the HEAD options (%s, %s)', (side, date) => {
        useFakeDate(date);

        renderToStaticMarkup(createElement(OngoingsWidget, { side }));

        const [[options]] = mocks.infiniteListCalls as [[CapturedOptions]];
        const head = headOngoingsWidgetOptions(side).queryKey;
        expect(options.queryKey).toStrictEqual(head);
        expect(hashKey(options.queryKey)).toBe(hashKey(head));
    });
});

describe('ongoingsOptions', () => {
    it.each(
        Object.entries(DATES).flatMap(([name, date]) =>
            (['center', 'left', 'right'] as const).map((side) => ({
                name,
                date,
                side,
            })),
        ),
    )('equals the HEAD widget key: $side, $name', ({ date, side }) => {
        useFakeDate(date);
        const size = side === 'center' ? HEAD_CENTER_SIZE : HEAD_SIDEBAR_SIZE;
        const component = ongoingsOptions({ size }).queryKey;
        const head = headOngoingsWidgetOptions(side).queryKey;

        expect(component).toStrictEqual(head);
        expect(hashKey(component)).toBe(hashKey(head));
    });

    it.each(Object.entries(DATES))(
        'keys the loader size like both widget sizes (%s)',
        (_, date) => {
            useFakeDate(date);
            const loader = ongoingsOptions({
                size: 5,
                client: ssrRequestClient(),
            }).queryKey;

            for (const side of ['center', 'left'] as const) {
                const head = headOngoingsWidgetOptions(side).queryKey;
                expect(loader).toStrictEqual(head);
                expect(hashKey(loader)).toBe(hashKey(head));
            }
        },
    );

    it('hashes another size differently', () => {
        useFakeDate(DATES.september);

        expect(hashKey(ongoingsOptions({ size: 10 }).queryKey)).not.toBe(
            hashKey(ongoingsOptions({ size: 5 }).queryKey),
        );
    });

    it('hashes another season differently', () => {
        useFakeDate(DATES.september);
        const september = ongoingsOptions({ size: 5 }).queryKey;
        vi.setSystemTime(new Date(DATES.spring));

        expect(hashKey(ongoingsOptions({ size: 5 }).queryKey)).not.toBe(
            hashKey(september),
        );
    });

    it('sends the widget request from the loader', async () => {
        useFakeDate(DATES.september);
        const client = createRequestClient({
            baseUrl: BASE_URL,
            authToken: 'token',
        });
        const fromLoader = await sentRequest(
            ongoingsOptions({ size: 5, client }),
            client,
        );
        const fromWidget = await sentRequest(
            headOngoingsWidgetOptions('center'),
            getBrowserClient(),
        );

        expect(fromLoader.method).toBe('POST');
        expect(fromLoader.path).toBe('/anime?size=5&page=1');
        expect(fromLoader).toEqual(fromWidget);
    });
});

type FeedFilters = Required<
    Omit<UiFeedSettingsOutput, 'only_followed' | 'widgets'>
>;

const NO_FILTERS: FeedFilters = {
    feed_content_types: null,
    comment_content_types: null,
    article_content_types: null,
    article_categories: null,
    collection_content_types: null,
    review_content_types: null,
};

// Copy of the feed args builder in HEAD feed-widget.tsx.
function headWidgetFeedArgs(
    onlyFollowed: boolean,
    filters: FeedFilters,
): FeedArgs {
    const args: FeedArgs = {};

    if (onlyFollowed) args.only_followed = true;

    if (filters.feed_content_types !== null)
        args.feed_content_types = filters.feed_content_types;
    if (filters.comment_content_types?.length)
        args.comment_content_types = filters.comment_content_types;
    if (filters.article_content_types?.length)
        args.article_content_types = filters.article_content_types;
    if (filters.article_categories?.length)
        args.article_categories = filters.article_categories;
    if (filters.collection_content_types?.length)
        args.collection_content_types = filters.collection_content_types;
    if (filters.review_content_types?.length)
        args.review_content_types = filters.review_content_types;

    return args;
}

const CUSTOM_FEED: UiFeedSettingsOutput = {
    only_followed: true,
    feed_content_types: [
        FeedContentTypeEnum.COMMENT,
        FeedContentTypeEnum.ARTICLE,
    ],
    comment_content_types: [
        FeedCommentContentTypeEnum.ANIME,
        FeedCommentContentTypeEnum.MANGA,
    ],
    article_content_types: null,
    article_categories: [],
    collection_content_types: [FeedCollectionContentTypeEnum.ANIME],
    review_content_types: [],
};

const FEED_ARGS_CASES: {
    name: string;
    onlyFollowed: boolean;
    filters: FeedFilters;
}[] = [
    { name: 'no filters', onlyFollowed: false, filters: NO_FILTERS },
    { name: 'only followed', onlyFollowed: true, filters: NO_FILTERS },
    {
        name: 'every section off',
        onlyFollowed: false,
        filters: { ...NO_FILTERS, feed_content_types: [] },
    },
    {
        name: 'custom sections',
        onlyFollowed: true,
        filters: { ...NO_FILTERS, ...CUSTOM_FEED } as FeedFilters,
    },
    {
        name: 'every group set',
        onlyFollowed: false,
        filters: {
            feed_content_types: [FeedContentTypeEnum.ARTICLE],
            comment_content_types: [FeedCommentContentTypeEnum.EDIT],
            article_content_types: [FeedArticleContentTypeEnum.NO_CONTENT],
            article_categories: [FeedArticleCategoryEnum.NEWS],
            collection_content_types: [FeedCollectionContentTypeEnum.NOVEL],
            review_content_types: null,
        },
    },
];

describe('buildFeedArgs', () => {
    it.each(FEED_ARGS_CASES)(
        'equals the HEAD widget args: $name',
        ({ onlyFollowed, filters }) => {
            expect(buildFeedArgs(filters, onlyFollowed)).toStrictEqual(
                headWidgetFeedArgs(onlyFollowed, filters),
            );
        },
    );

    it('reads unset groups like null ones', () => {
        expect(buildFeedArgs({}, false)).toStrictEqual({});
        expect(
            buildFeedArgs(
                { comment_content_types: [FeedCommentContentTypeEnum.ANIME] },
                false,
            ),
        ).toStrictEqual({
            comment_content_types: [FeedCommentContentTypeEnum.ANIME],
        });
    });

    it('disables the feed only when every section is off', () => {
        expect(isFeedDisabled({ feed_content_types: [] })).toBe(true);
        expect(isFeedDisabled({ feed_content_types: null })).toBe(false);
        expect(isFeedDisabled({})).toBe(false);
        expect(
            isFeedDisabled({
                feed_content_types: [FeedContentTypeEnum.REVIEW],
            }),
        ).toBe(false);
    });
});

const uiWithFeed = (feed: UiFeedSettingsOutput): UserCustomizationResponse => ({
    ...DEFAULT_USER_UI,
    preferences: {
        ...DEFAULT_USER_UI.preferences,
        feed: { ...DEFAULT_USER_UI.preferences.feed, ...feed },
    },
});

const isFeedQuery = (queryKey: readonly unknown[]) =>
    (queryKey[0] as { _id: string })._id === 'getFeed';

async function loaderFeedKey(
    loggedIn: boolean,
    ui?: UserCustomizationResponse,
) {
    loaderOptions.length = 0;
    await runHomeLoader(undefined, loggedIn, ui);

    return loaderOptions.find((options) => isFeedQuery(options.queryKey))
        ?.queryKey;
}

function widgetFeedQuery(loggedIn: boolean, ui?: UserCustomizationResponse) {
    mocks.user = loggedIn ? PROFILE : undefined;
    mocks.ui = ui;
    mocks.feedQueries = [];

    renderToStaticMarkup(createElement(FeedWidget, { side: 'center' }));

    const [query] = mocks.feedQueries;
    if (!query) throw new Error('the feed widget made no query');

    return query;
}

const FEED_PREFETCH_CASES = [
    { name: 'anonymous', loggedIn: false, ui: undefined },
    { name: 'logged in, no cached ui', loggedIn: true, ui: undefined },
    { name: 'logged in, no feed prefs', loggedIn: true, ui: uiWithFeed({}) },
    {
        name: 'logged in, only followed',
        loggedIn: true,
        ui: uiWithFeed({ only_followed: true }),
    },
    {
        name: 'logged in, custom sections',
        loggedIn: true,
        ui: uiWithFeed(CUSTOM_FEED),
    },
    {
        name: 'anonymous with a stale cached ui',
        loggedIn: false,
        ui: uiWithFeed(CUSTOM_FEED),
    },
];

describe('home feed prefetch', () => {
    beforeEach(() => {
        useFakeDate(DATES.september);
    });

    it.each(FEED_PREFETCH_CASES)(
        'prefetches the widget feed key: $name',
        async ({ loggedIn, ui }) => {
            const loader = await loaderFeedKey(loggedIn, ui);
            const widget = widgetFeedQuery(loggedIn, ui);

            expect(widget.enabled).toBe(true);
            expect(loader).toStrictEqual(widget.queryKey);
            expect(hashKey(loader ?? [])).toBe(hashKey(widget.queryKey));
        },
    );

    it('sends the preferences as the body', async () => {
        expect(await loaderFeedKey(true, uiWithFeed(CUSTOM_FEED))).toEqual([
            {
                _id: 'getFeed',
                baseUrl: BASE_URL,
                _infinite: true,
                body: {
                    only_followed: true,
                    feed_content_types: ['comment', 'article'],
                    comment_content_types: ['anime', 'manga'],
                    collection_content_types: ['anime'],
                },
            },
        ]);
    });

    it('keeps the anonymous key of the HEAD loader', async () => {
        const head = getFeedInfiniteOptions({
            body: { feed_content_types: undefined },
            client: ssrRequestClient(),
        }).queryKey;

        expect(hashKey((await loaderFeedKey(false)) ?? [])).toBe(hashKey(head));
    });

    it('ignores the dead ?type param', async () => {
        await runHomeLoader('comments', false);

        const feed = loaderOptions.find((options) =>
            isFeedQuery(options.queryKey),
        );

        expect(feed?.queryKey).toStrictEqual(await loaderFeedKey(false));
    });

    it('skips the prefetch when every section is off, like the widget', async () => {
        const ui = uiWithFeed({ feed_content_types: [] });

        expect(await loaderFeedKey(true, ui)).toBeUndefined();
        expect(widgetFeedQuery(true, ui).enabled).toBe(false);
    });

    it('still prefetches for an anonymous visitor with every section off in a stale ui', async () => {
        const ui = uiWithFeed({ feed_content_types: [] });

        expect(await loaderFeedKey(false, ui)).toStrictEqual(
            widgetFeedQuery(false, ui).queryKey,
        );
        expect(widgetFeedQuery(false, ui).enabled).toBe(true);
    });
});

type WidgetCall = [
    { queryKey: readonly unknown[]; refetchInterval?: unknown },
    { enabled?: boolean } | undefined,
];

const widgetCalls = () => mocks.infiniteListCalls as WidgetCall[];
const side: UIFeedWidgetSide = 'left';

describe('followingHistoryPreviewOptions', () => {
    it('asks for 3 items', () => {
        expect(followingHistoryPreviewOptions().queryKey[0]).toMatchObject({
            query: { size: 3 },
        });
    });

    it('keys the loader like the widget', () => {
        mocks.user = PROFILE;
        renderToStaticMarkup(createElement(HistoryWidget, { side }));

        const [[options]] = widgetCalls();
        const loader = followingHistoryPreviewOptions({
            client: ssrRequestClient('token'),
        }).queryKey;
        expect(hashKey(loader)).toBe(hashKey(options.queryKey));
    });

    it('keys the loader like the widget for the loader options actually used', async () => {
        const calls = await runHomeLoader(undefined, true);
        const used = calls.find((call) => call.includes('followingHistory'));

        expect(used).toContain(
            serialize(followingHistoryPreviewOptions().queryKey),
        );
    });
});

describe('HistoryWidget polling', () => {
    it('polls once a minute', () => {
        mocks.user = PROFILE;
        mocks.visible = true;
        renderToStaticMarkup(createElement(HistoryWidget, { side }));

        expect(widgetCalls()[0][0].refetchInterval).toBe(60_000);
    });

    it('does not fetch or poll while it is not visible', () => {
        mocks.user = PROFILE;
        mocks.visible = false;
        renderToStaticMarkup(createElement(HistoryWidget, { side }));

        expect(widgetCalls()[0][1]).toEqual({ enabled: false });
    });

    it('does not fetch or poll without a user', () => {
        mocks.visible = true;
        renderToStaticMarkup(createElement(HistoryWidget, { side }));

        expect(widgetCalls()[0][1]).toEqual({ enabled: false });
    });

    it('fetches and polls while visible with a user', () => {
        mocks.user = PROFILE;
        mocks.visible = true;
        renderToStaticMarkup(createElement(HistoryWidget, { side }));

        expect(widgetCalls()[0][1]).toEqual({ enabled: true });
    });
});

describe('homeArticlesOptions', () => {
    it('asks for 3 items', () => {
        expect(
            homeArticlesOptions({ body: { sort: HOME_ARTICLES_NEWEST_SORT } })
                .queryKey[0],
        ).toMatchObject({ query: { size: 3 } });
    });

    it('keys the loader like the widget on its default tab', () => {
        renderToStaticMarkup(createElement(ArticlesWidget, { side }));

        const [[options]] = widgetCalls();
        const loader = homeArticlesOptions({
            body: { sort: HOME_ARTICLES_NEWEST_SORT },
            client: ssrRequestClient(),
        }).queryKey;
        expect(hashKey(loader)).toBe(hashKey(options.queryKey));
    });

    it('hashes the popular tab differently from the newest tab', () => {
        expect(
            hashKey(
                homeArticlesOptions({
                    body: { sort: HOME_ARTICLES_POPULAR_SORT },
                }).queryKey,
            ),
        ).not.toBe(
            hashKey(
                homeArticlesOptions({
                    body: { sort: HOME_ARTICLES_NEWEST_SORT },
                }).queryKey,
            ),
        );
    });

    it('prefetches the newest articles on the server for everyone', async () => {
        for (const loggedIn of [false, true]) {
            const calls = await runHomeLoader(undefined, loggedIn);

            expect(
                calls.filter((call) => call.includes('getArticles')),
            ).toEqual([expect.stringContaining('"query":{"size":3}')]);
        }
    });
});

describe('home loader stats', () => {
    it('does not prefetch the manga and novel read stats', async () => {
        const calls = await runHomeLoader(undefined, true);

        expect(calls.some((call) => call.includes('userReadStats'))).toBe(
            false,
        );
        expect(calls.some((call) => call.includes('userWatchStats'))).toBe(
            true,
        );
    });
});

describe('CollectionsWidget', () => {
    it('does not fetch until visible', () => {
        renderToStaticMarkup(createElement(CollectionsWidget, { side }));

        expect(widgetCalls()[0][1]).toEqual({ enabled: false });
    });

    it('fetches once visible', () => {
        mocks.visible = true;
        renderToStaticMarkup(createElement(CollectionsWidget, { side }));

        expect(widgetCalls()[0][1]).toEqual({ enabled: true });
    });

    it('shows the skeleton, not the empty state, while it has not fetched', () => {
        mocks.pending = true;
        const html = renderToStaticMarkup(
            createElement(CollectionsWidget, { side }),
        );

        expect(html).not.toContain('Немає колекцій');
    });

    it('links the header to the canonical first page', () => {
        expect(
            renderToStaticMarkup(createElement(CollectionsWidget, { side })),
        ).toContain('href="/collections?page=1"');
    });
});
