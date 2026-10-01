import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    getBrowserClient,
    type ReadContentTypeEnum,
    userReadStatsOptions,
    userWatchStatsOptions,
} from '@hikka/api';

import UserListStats from './user-list-stats';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const USERNAME = 'someone';
const BASE_URL = 'https://api.example.test';

vi.mock('@/utils/navigation', () => ({
    useParams: () => ({ username: USERNAME }),
    Link: ({ children }: { children?: React.ReactNode }) => (
        <span>{children}</span>
    ),
}));

const fetchMock = vi.fn(
    (_input: Request) => new Promise<Response>(() => undefined),
);

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const WATCH_STATS = {
    completed: 1,
    watching: 0,
    planned: 0,
    dropped: 0,
    on_hold: 0,
    duration: 60,
};

const readStatsKey = (type: ContentTypeEnum) =>
    userReadStatsOptions({
        path: { username: USERNAME, content_type: type as ReadContentTypeEnum },
    }).queryKey;

let container: HTMLDivElement;
let root: Root;

const trigger = (label: string) => {
    const element = container.querySelector<HTMLElement>(
        `[aria-label="${label}"]`,
    );
    if (!element) throw new Error(`no ${label} tab`);
    return element;
};

const bodyText = () =>
    container.querySelector('#user-list-stats')?.textContent ?? '';

beforeEach(async () => {
    queryClient.clear();
    fetchMock.mockClear();
    configureBrowserClient({ baseUrl: BASE_URL });
    getBrowserClient().setConfig({ fetch: fetchMock as typeof fetch });
    queryClient.setQueryData(
        userWatchStatsOptions({ path: { username: USERNAME } }).queryKey,
        WATCH_STATS as never,
    );
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <UserListStats />
            </QueryClientProvider>,
        );
    });
});

afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
});

describe('UserListStats', () => {
    it('renders the anime stats from the cache without a request', () => {
        expect(bodyText()).toContain('Всього');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('renders a skeleton while the manga stats load', async () => {
        await act(async () => trigger('Манґа').click());

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(bodyText()).not.toContain('Всього');
        expect(
            container.querySelector('#user-list-stats .animate-pulse'),
        ).not.toBeNull();
    });

    it.each([
        ['Манґа', ContentTypeEnum.MANGA],
        ['Ранобе', ContentTypeEnum.NOVEL],
    ] as const)(
        'warms the %s stats when the tab gets focus',
        async (label, type) => {
            await act(async () => trigger(label).focus());

            expect(
                queryClient.getQueryState(readStatsKey(type))?.fetchStatus,
            ).toBe('fetching');
        },
    );

    it('holds one stats observer per shown tab', async () => {
        const watchKey = userWatchStatsOptions({
            path: { username: USERNAME },
        }).queryKey;
        const observers = () =>
            Object.fromEntries(
                queryClient
                    .getQueryCache()
                    .getAll()
                    .map((query) => [
                        query.queryHash,
                        query.getObserversCount(),
                    ]),
            );

        expect(observers()).toEqual({ [hashKey(watchKey)]: 1 });

        await act(async () => trigger('Манґа').click());

        expect(observers()).toEqual({
            [hashKey(watchKey)]: 0,
            [hashKey(readStatsKey(ContentTypeEnum.MANGA))]: 1,
        });
    });
});
