import { renderToStaticMarkup } from 'react-dom/server';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, createRequestClient } from '@hikka/api';

import { homeWatchingOptions } from '../../../queries';
import WatchingTracker from './watching-tracker';

const mocks = vi.hoisted(() => ({
    calls: [] as [{ queryKey: readonly unknown[] }, unknown][],
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
