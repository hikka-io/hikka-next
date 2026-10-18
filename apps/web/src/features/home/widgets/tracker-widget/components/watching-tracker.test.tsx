import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
    ContentStatusEnum,
    configureBrowserClient,
    createRequestClient,
} from '@hikka/api';

import { homeWatchingOptions } from '../../../queries';
import WatchingTracker from './watching-tracker';

const mocks = vi.hoisted(() => ({
    calls: [] as [{ queryKey: readonly unknown[] }, unknown][],
    query: {} as Record<string, unknown>,
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: { username: 'someone' } }),
    useSessionUI: () => ({ preferences: {} }),
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (...args: [{ queryKey: readonly unknown[] }, unknown]) => {
        mocks.calls.push(args);
        return {
            list: [],
            ref: vi.fn(),
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: vi.fn(),
            ...mocks.query,
        };
    },
}));

vi.mock('@/utils/navigation', () => ({
    Link: () => null,
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/tracking', () => ({
    ListEntryEditDialog: () => null,
}));

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

describe('WatchingTracker list key', () => {
    it('matches the home loader key', () => {
        renderToStaticMarkup(
            <QueryClientProvider client={new QueryClient()}>
                <WatchingTracker />
            </QueryClientProvider>,
        );

        const [[options, extra]] = mocks.calls;
        const loader = homeWatchingOptions(
            'someone',
            createRequestClient({ baseUrl: BASE_URL }),
        );

        expect(hashKey(options.queryKey)).toBe(hashKey(loader.queryKey));
        expect(extra).toEqual({ enabled: true });
    });
});

const entry = (slug: string, status: string, episodesTotal: number) => ({
    episodes: 0,
    anime: {
        slug,
        status,
        title_ua: slug,
        image: null,
        episodes_total: episodesTotal,
        year: 2026,
        media_type: 'tv',
    },
});

const renderTracker = (hideOngoings: boolean) =>
    renderToStaticMarkup(
        <QueryClientProvider client={new QueryClient()}>
            <WatchingTracker hideOngoings={hideOngoings} />
        </QueryClientProvider>,
    );

describe('WatchingTracker hidden ongoings', () => {
    afterEach(() => {
        mocks.query = {};
    });

    it('selects the first entry that is not hidden', () => {
        mocks.query = {
            list: [
                entry('airing', ContentStatusEnum.ONGOING, 24),
                entry('aired', ContentStatusEnum.FINISHED, 12),
            ],
        };

        expect(renderTracker(true)).toContain('aria-valuemax="12"');
        expect(renderTracker(false)).toContain('aria-valuemax="24"');
    });

    it('offers to show ongoings once every page is hidden', () => {
        mocks.query = {
            list: [entry('airing', ContentStatusEnum.ONGOING, 24)],
        };

        expect(renderTracker(true)).toContain('Показати онґоїнґи');
    });

    it('loads the next page instead of claiming everything is hidden', async () => {
        const fetchNextPage = vi.fn();
        mocks.query = {
            list: [entry('airing', ContentStatusEnum.ONGOING, 24)],
            hasNextPage: true,
            fetchNextPage,
        };

        expect(renderTracker(true)).not.toContain('Показати онґоїнґи');

        const root = createRoot(document.createElement('div'));
        await act(async () => {
            root.render(
                <QueryClientProvider client={new QueryClient()}>
                    <WatchingTracker hideOngoings />
                </QueryClientProvider>,
            );
        });
        await act(async () => root.unmount());

        expect(fetchNextPage).toHaveBeenCalledTimes(1);
    });
});
