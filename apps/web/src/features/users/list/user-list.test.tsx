import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    ContentTypeEnum,
    configureBrowserClient,
    getBrowserClient,
    type ReadContentTypeEnum,
} from '@hikka/api';

import type { UserlistSearch } from '@/utils/search-schemas';

import { userReadListOptions, userWatchListOptions } from '../queries';
import UserList from './user-list';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const BASE_URL = 'https://api.example.test';

const mocks = vi.hoisted(() => ({
    params: {} as Record<string, string>,
    search: {} as Record<string, unknown>,
}));

vi.mock('@/utils/navigation', () => ({
    useParams: () => mocks.params,
    useRouteSearch: () => mocks.search,
}));

vi.mock('@/features/catalog', () => ({
    CatalogSummary: ({ isLoading }: { isLoading: boolean }) => (
        <div data-summary={isLoading ? 'loading' : 'ready'} />
    ),
    useCatalogView: () => ({ view: 'grid' }),
}));

vi.mock('./components/grid-view', () => ({
    default: ({ data }: { data: { reference: string }[] }) => (
        <div data-grid={data.map((item) => item.reference).join(',')} />
    ),
}));

vi.mock('./components/records-not-found', () => ({
    default: () => <div data-not-found />,
}));

const PAGE = { total: 1, pages: 1, page: 1 };

const fetchMock = vi.fn(
    (_input: Request) => new Promise<Response>(() => undefined),
);

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});

const seed = (queryKey: readonly unknown[], reference: string) => {
    queryClient.setQueryData(queryKey, {
        pages: [{ pagination: PAGE, list: [{ reference }] }],
        pageParams: [1],
    });
};

const COMPLETED: UserlistSearch = { status: 'completed', sort: 'watch_score' };
const PLANNED: UserlistSearch = { status: 'planned', sort: 'watch_score' };

let container: HTMLDivElement;
let root: Root;

const render = async (content_type: ContentTypeEnum) => {
    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <UserList
                    content_type={
                        content_type as Parameters<
                            typeof UserList
                        >[0]['content_type']
                    }
                />
            </QueryClientProvider>,
        );
    });
};

const grid = () =>
    container.querySelector('[data-grid]')?.getAttribute('data-grid');

beforeEach(() => {
    queryClient.clear();
    fetchMock.mockClear();
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    configureBrowserClient({ baseUrl: BASE_URL });
    getBrowserClient().setConfig({ fetch: fetchMock as typeof fetch });
    container = document.createElement('div');
    root = createRoot(container);
});

afterEach(async () => {
    await act(async () => root.unmount());
    vi.unstubAllGlobals();
});

describe('UserList', () => {
    it('keeps the current list while a filter change loads', async () => {
        mocks.params = { username: 'someone', content_type: 'anime' };
        mocks.search = COMPLETED;
        seed(userWatchListOptions('someone', COMPLETED).queryKey, 'completed');
        await render(ContentTypeEnum.ANIME);

        expect(grid()).toBe('completed');

        mocks.search = PLANNED;
        await render(ContentTypeEnum.ANIME);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(grid()).toBe('completed');
    });

    it('does not show another user list while the new one loads', async () => {
        mocks.params = { username: 'someone', content_type: 'anime' };
        mocks.search = COMPLETED;
        seed(userWatchListOptions('someone', COMPLETED).queryKey, 'someone');
        await render(ContentTypeEnum.ANIME);

        mocks.params = { username: 'other', content_type: 'anime' };
        await render(ContentTypeEnum.ANIME);

        expect(grid()).toBeUndefined();
    });

    it('does not show the manga list while the novel list loads', async () => {
        const search = { status: 'completed', sort: 'read_score' };
        mocks.params = { username: 'someone', content_type: 'manga' };
        mocks.search = search;
        seed(
            userReadListOptions(
                'someone',
                ContentTypeEnum.MANGA as ReadContentTypeEnum,
                search,
            ).queryKey,
            'manga',
        );
        await render(ContentTypeEnum.MANGA);

        expect(grid()).toBe('manga');

        mocks.params = { username: 'someone', content_type: 'novel' };
        await render(ContentTypeEnum.NOVEL);

        expect(grid()).toBeUndefined();
    });

    it('renders a loading skeleton before the first page arrives', async () => {
        mocks.params = { username: 'someone', content_type: 'anime' };
        mocks.search = COMPLETED;
        await render(ContentTypeEnum.ANIME);

        expect(
            container.querySelector('[data-summary="loading"]'),
        ).not.toBeNull();
        expect(container.querySelector('.animate-pulse')).not.toBeNull();
    });
});
