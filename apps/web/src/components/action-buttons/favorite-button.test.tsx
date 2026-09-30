import { act, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';

import {
    hashKey,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
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
    configureBrowserClient,
    FavouriteContentTypeEnum,
    getFavouriteQueryKey,
} from '@hikka/api';

import { QUERY_CLIENT_DEFAULTS } from '@/utils/api/query-defaults';

import FavoriteButton from './favorite-button';

vi.mock('@/utils/api/invalidate-content-state', () => ({
    applyFavouriteDeletion: vi.fn(),
    applyFavouriteMutation: vi.fn(),
}));

const BASE_URL = 'https://api.test';
const SLUG = 'anime-slug';
const URL = `${BASE_URL}/favourite/anime/${SLUG}`;
const FAVOURITE = { reference: 'favourite', created: 1 };

type Call = { method: string; url: string };

let calls: Call[] = [];
let getStatus = 404;
let unmounts: (() => Promise<void>)[] = [];

const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

const flush = () =>
    act(async () => {
        for (let i = 0; i < 5; i++) {
            await new Promise((done) => setTimeout(done, 0));
        }
    });

const button = (props: { disabled?: boolean } = {}) => (
    <FavoriteButton
        slug={SLUG}
        content_type={FavouriteContentTypeEnum.ANIME}
        {...props}
    />
);

const entryHash = () =>
    hashKey(
        getFavouriteQueryKey({
            path: { content_type: FavouriteContentTypeEnum.ANIME, slug: SLUG },
        }),
    );

const mount = async (element: ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: QUERY_CLIENT_DEFAULTS },
    });
    const container = document.body.appendChild(document.createElement('div'));
    const root = createRoot(container);
    const rerender = async (next: ReactElement) => {
        await act(async () =>
            root.render(
                <QueryClientProvider client={queryClient}>
                    {next}
                </QueryClientProvider>,
            ),
        );
        await flush();
    };

    unmounts.push(async () => {
        await act(async () => root.unmount());
        container.remove();
    });
    await rerender(element);

    return { container, queryClient, rerender };
};

const isFilled = (container: HTMLElement) =>
    container.querySelector('.text-red-500') !== null;

const click = async (container: HTMLElement) => {
    await act(async () => container.querySelector('button')?.click());
    await flush();
};

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('fetch', async (request: Request) => {
        calls.push({ method: request.method, url: request.url });

        if (request.method === 'GET') {
            return getStatus === 200
                ? json(FAVOURITE)
                : json({ message: 'Error', code: 'error' }, getStatus);
        }

        return json(FAVOURITE);
    });
});

afterEach(async () => {
    for (const unmount of unmounts) await unmount();
    unmounts = [];
    calls = [];
    getStatus = 404;
    vi.unstubAllGlobals();
});

describe('FavoriteButton', () => {
    it('stores a missing favourite as null and does not refetch it for new buttons', async () => {
        const view = await mount(button());

        expect(calls).toEqual([{ method: 'GET', url: URL }]);
        expect(
            view.queryClient.getQueryCache().get(entryHash())?.state,
        ).toMatchObject({ status: 'success', data: null });
        expect(isFilled(view.container)).toBe(false);

        await view.rerender(
            <>
                {button()}
                {button()}
            </>,
        );

        expect(calls).toHaveLength(1);
    });

    it('adds a missing favourite on click', async () => {
        const { container } = await mount(button());

        await click(container);

        expect(calls.at(-1)).toEqual({ method: 'PUT', url: URL });
    });

    it('shows a stored favourite and removes it on click', async () => {
        getStatus = 200;
        const { container } = await mount(button());

        expect(isFilled(container)).toBe(true);

        await click(container);

        expect(calls.at(-1)).toEqual({ method: 'DELETE', url: URL });
    });

    it('shows an unfilled heart when the fetch fails with another error', async () => {
        getStatus = 500;
        const { container, queryClient } = await mount(button());

        expect(queryClient.getQueryCache().get(entryHash())?.state.status).toBe(
            'error',
        );
        expect(isFilled(container)).toBe(false);
    });

    it('does not fetch while disabled', async () => {
        await mount(button({ disabled: true }));

        expect(calls).toEqual([]);
    });
});
