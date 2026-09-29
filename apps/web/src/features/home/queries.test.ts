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
    getBrowserClient,
    type ProfileResponse,
    paginationPageParam,
    profileQueryKey,
    type SeasonEnum,
    searchAnimeInfiniteOptions,
} from '@hikka/api';

import { getCurrentSeason } from '@/utils/season';
import { getOngoingsSort } from '@/utils/sort';

import { Route as HomeRoute } from '../../routes/_pages/index';
import { ongoingsOptions } from './queries';
import type { UIFeedWidgetSide } from './types';
import OngoingsWidget from './widgets/ongoings-widget';

const mocks = vi.hoisted(() => ({
    infiniteListCalls: [] as unknown[][],
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    Link: ({ to, children }: { to: string; children?: ReactNode }) =>
        createElement('a', { href: to }, children),
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: unknown[]) => {
        mocks.infiniteListCalls.push(args);
        return { list: [], isLoading: false };
    },
}));

vi.mock('@/features/auth/hooks/use-session-ui', async (importOriginal) => ({
    ...(await importOriginal<
        typeof import('@/features/auth/hooks/use-session-ui')
    >()),
    useSessionUI: () => ({
        preferences: { title_language: 'title_ua', name_language: 'name_ua' },
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

async function runHomeLoader(type: string | undefined, loggedIn: boolean) {
    const queryClient = new QueryClient();
    const calls: string[] = [];

    if (loggedIn) queryClient.setQueryData(profileQueryKey(), PROFILE);

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
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{"feed_content_types":"<undefined>"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
    ],
    'anonymous, comments feed': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{"feed_content_types":["comment"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
    ],
    'logged in, september': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"userWatchList","baseUrl":"https://api.example.test","_infinite":true,"body":{"watch_status":"watching","sort":["watch_updated:desc"]},"path":{"username":"tester"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"followingHistory","baseUrl":"https://api.example.test","_infinite":true}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"userWatchStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"content_type":"manga","username":"tester"}}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"userReadStats","baseUrl":"https://api.example.test","path":{"content_type":"novel","username":"tester"}}]',
        'ensureQueryData queryFn,queryKey "<undefined>" [{"_id":"followStats","baseUrl":"https://api.example.test","path":{"username":"tester"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{"feed_content_types":"<undefined>"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["summer",2026],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["summer"],"media_type":["tv"],"years":[2026,2026],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
    ],
    'anonymous, new year': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{"feed_content_types":"<undefined>"}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["fall",2027],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["fall"],"media_type":["tv"],"years":[2027,2027],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
    ],
    'anonymous, spring': [
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam {"body":{}} [{"_id":"getFeed","baseUrl":"https://api.example.test","_infinite":true,"body":{"feed_content_types":["article"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"animeSchedule","baseUrl":"https://api.example.test","_infinite":true,"body":{"airing_season":["spring",2027],"status":["ongoing","announced"]}}]',
        'ensureInfiniteQueryData queryFn,queryKey,initialPageParam,getNextPageParam 1 [{"_id":"searchAnime","baseUrl":"https://api.example.test","_infinite":true,"body":{"season":["spring"],"media_type":["tv"],"years":[2027,2027],"genres":["-ecchi","-hentai"],"status":["ongoing"],"sort":["score:desc","scored_by:desc","native_score:desc","native_scored_by:desc"]},"query":{"size":5}}]',
    ],
};

describe('home loader', () => {
    it.each(HOME_CASES)('keeps the HEAD calls: $name', async ({
        name,
        date,
        type,
        loggedIn,
    }) => {
        useFakeDate(date);

        expect(await runHomeLoader(type, loggedIn)).toEqual(
            EXPECTED_HOME_CALLS[name],
        );
    });
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

    it.each(
        Object.entries(DATES),
    )('keys the loader size like both widget sizes (%s)', (_, date) => {
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
    });

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
