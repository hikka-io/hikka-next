import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, createRequestClient } from '@hikka/api';

import {
    type ScheduleSearch,
    scheduleSearchSchema,
} from '@/utils/search-schemas';

import { Route } from '../../routes/_pages/schedule';
import { scheduleOptions } from './queries';
import ScheduleList from './schedule-list';

type Options = { queryKey: readonly unknown[] };

const mocks = vi.hoisted(() => ({
    search: {} as ScheduleSearch,
    calls: [] as Options[],
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useRouteSearch: () => mocks.search,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (options: Options) => {
        mocks.calls.push(options);
        return { list: undefined, isLoading: true, hasNextPage: false };
    },
}));

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

afterEach(() => {
    mocks.calls = [];
    vi.useRealTimers();
});

const CASES = [
    { name: 'no filters', raw: {} },
    { name: 'season and year', raw: { season: 'winter', year: '2024' } },
    {
        name: 'status and watched only',
        raw: { status: ['finished'], only_watch: 'true' },
    },
];

async function loaderKey(search: ScheduleSearch) {
    const keys: Options['queryKey'][] = [];
    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        prefetchInfiniteQuery: vi.fn(async (options: Options) => {
            keys.push(options.queryKey);
        }),
    });
    const loader = Route.options.loader as (ctx: unknown) => Promise<unknown>;

    await loader({
        deps: search,
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: BASE_URL,
                internalBaseUrl: 'http://backend:8000',
            }),
        },
    });

    expect(keys).toHaveLength(1);
    return keys[0];
}

describe('scheduleOptions', () => {
    it.each(CASES)('keys the loader like the list: $name', async ({ raw }) => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-29T12:00:00'));
        mocks.search = scheduleSearchSchema.parse(raw);

        renderToStaticMarkup(<ScheduleList />);

        expect(hashKey(await loaderKey(mocks.search))).toBe(
            hashKey(mocks.calls[0].queryKey),
        );
    });

    it('defaults to the current season and the airing statuses', () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-29T12:00:00'));

        expect(scheduleOptions({}).queryKey[0].body).toEqual({
            airing_season: ['summer', 2026],
            status: ['ongoing', 'announced'],
            only_watch: undefined,
        });
    });
});
