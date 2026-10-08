import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    createRequestClient,
    followersListInfiniteOptions,
    followingListInfiniteOptions,
    getBrowserClient,
} from '@hikka/api';

import { type FollowListKind, followListOptions } from '../queries';
import FollowListModal from './follow-list-modal';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const BASE_URL = 'https://api.example.test';
const USERNAME = 'someone';

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: USERNAME }),
}));

vi.mock('@/components/ui/responsive-modal', () => ({
    ResponsiveModal: ({ children }: { children: ReactNode }) => children,
    ResponsiveModalContent: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('./components/follow-user-item', () => ({
    default: () => null,
}));

const requests: URL[] = [];

const fetchMock = vi.fn(async (input: Request) => {
    requests.push(new URL(input.url));

    return new Response(
        JSON.stringify({
            pagination: { total: 0, pages: 1, page: 1 },
            list: [],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
    );
});

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

let container: HTMLDivElement;
let root: Root;

const KINDS = ['followers', 'followings'] as const satisfies FollowListKind[];

const HEAD_KEYS = {
    followers: () =>
        followersListInfiniteOptions({ path: { username: USERNAME } }).queryKey,
    followings: () =>
        followingListInfiniteOptions({ path: { username: USERNAME } }).queryKey,
};

const PATHS = {
    followers: `/follow/${USERNAME}/followers`,
    followings: `/follow/${USERNAME}/following`,
};

beforeEach(() => {
    queryClient.clear();
    requests.length = 0;
    configureBrowserClient({ baseUrl: BASE_URL });
    getBrowserClient().setConfig({ fetch: fetchMock as typeof fetch });
    container = document.createElement('div');
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
});

describe.each(KINDS)('FollowListModal(%s)', (kind) => {
    it('keeps the HEAD generated key', () => {
        expect(followListOptions(kind, USERNAME).queryKey).toStrictEqual(
            HEAD_KEYS[kind](),
        );
    });

    it('keys the loader like the component', () => {
        const client = createRequestClient({
            baseUrl: BASE_URL,
            internalBaseUrl: 'http://backend:8000',
            authToken: 'token',
        });

        expect(
            hashKey(followListOptions(kind, USERNAME, client).queryKey),
        ).toBe(hashKey(followListOptions(kind, USERNAME).queryKey));
    });

    it('holds one observer and sends one request for its list', async () => {
        await act(async () => {
            root.render(
                <QueryClientProvider client={queryClient}>
                    <FollowListModal open onOpenChange={() => {}} type={kind} />
                </QueryClientProvider>,
            );
        });

        const queries = queryClient.getQueryCache().getAll();
        expect(queries.map((query) => query.queryHash)).toEqual([
            hashKey(followListOptions(kind, USERNAME).queryKey),
        ]);
        expect(queries[0].getObserversCount()).toBe(1);
        expect(requests.map((url) => url.pathname)).toEqual([PATHS[kind]]);
    });
});
