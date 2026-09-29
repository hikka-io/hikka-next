import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import {
    dehydrate,
    hashKey,
    hydrate,
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
    type ArticleCategoryEnum,
    type ArticlesListResponse,
    configureBrowserClient,
    createRequestClient,
    getArticlesInfiniteOptions,
    getBrowserClient,
} from '@hikka/api';

import type { ArticlesSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

import { Route as ArticlesRoute } from '../../routes/_pages/articles/index';
import ArticleList from './article-list/article-list';
import { articleListOptions } from './queries';

(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
    search: {} as Record<string, unknown>,
}));

vi.mock('@/utils/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/navigation')>()),
    useRouteSearch: () => mocks.search,
    Link: ({ to, children }: { to: string; children?: ReactNode }) => (
        <a href={to}>{children}</a>
    ),
}));

vi.mock('@/services/session', () => ({
    useSession: () => ({ user: undefined }),
}));

vi.mock('@/features/app-shell', () => ({
    usePageTitleAnchor: () => undefined,
}));

vi.mock('@/features/filters', () => ({
    FiltersModal: ({ children }: { children?: ReactNode }) => children,
    ArticleCategoryFilter: () => null,
    ArticleDraftsFilter: () => null,
    ClearFiltersFooter: () => null,
    Sort: () => null,
    TagFilter: () => null,
    UserFilter: () => null,
}));

vi.mock('@/components/filters-not-found', () => ({
    default: () => <p data-stub="not-found" />,
}));

vi.mock('./article-list/article-item', () => ({
    default: ({ article }: { article: { slug: string } }) => (
        <article data-slug={article.slug} />
    ),
}));

const BASE_URL = 'https://api.example.test';

const LIST: ArticlesListResponse = {
    pagination: { page: 1, pages: 1, total: 1 },
    list: [
        {
            data_type: 'article',
            author: {
                reference: '7d2f6a4e-1c3b-4b8e-9f0a-5e6d7c8b9a01',
                updated: null,
                created: 1700000000,
                description: null,
                username: 'tester',
                cover: null,
                active: true,
                avatar: 'https://cdn.example.test/avatar.jpg',
                role: 'user',
                is_followed: false,
            },
            tags: [],
            created: 1700000000,
            updated: 1700000000,
            comments_count: 0,
            vote_score: 0,
            my_score: 0,
            category: 'news',
            trusted: false,
            draft: false,
            views: 0,
            title: 'First article',
            slug: 'first-article',
            content: null,
            preview: [],
        },
    ],
};

const TOP = { authors: [], tags: [] };

type SentRequest = { method: string; path: string; body: string };

function jsonResponse(value: unknown) {
    return new Response(JSON.stringify(value), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

function recordingFetch(sent: SentRequest[]): typeof fetch {
    return async (input) => {
        const request =
            input instanceof Request ? input : new Request(String(input));
        const url = new URL(request.url);
        sent.push({
            method: request.method,
            path: url.pathname,
            body: await request.text(),
        });
        return jsonResponse(url.pathname === '/articles/top' ? TOP : LIST);
    };
}

function appQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60 * 1000, gcTime: Infinity, retry: false },
        },
    });
}

async function prefetchWithLoader(search: ArticlesSearch) {
    const serverSent: SentRequest[] = [];
    const apiClient = createRequestClient({ baseUrl: BASE_URL });
    apiClient.setConfig({ fetch: recordingFetch(serverSent) });

    const queryClient = appQueryClient();
    const loader = ArticlesRoute.options.loader as unknown as (
        ctx: unknown,
    ) => Promise<unknown>;
    await loader({ deps: search, context: { queryClient, apiClient } });

    return { state: dehydrate(queryClient), serverSent };
}

// Copy of the list query in HEAD article-list.tsx.
function headComponentOptions(search: ArticlesSearch) {
    return getArticlesInfiniteOptions({
        body: {
            categories: (search.categories as ArticleCategoryEnum[]) || [],
            author: search.author || undefined,
            sort: expandSort('article', search.sort, search.order),
            tags: search.tags || undefined,
            draft: Boolean(search.draft) ?? false,
        },
    });
}

const CASES: { name: string; search: ArticlesSearch; body: string }[] = [
    {
        name: 'no filters',
        search: {},
        body: '{"categories":[],"sort":["created:desc"],"draft":false}',
    },
    {
        name: 'tags',
        search: { tags: ['romance', 'isekai'] },
        body: '{"categories":[],"sort":["created:desc"],"tags":["romance","isekai"],"draft":false}',
    },
    {
        name: 'every filter',
        search: {
            author: 'tester',
            tags: ['romance'],
            categories: ['news'],
            draft: true,
            sort: 'created',
            order: 'asc',
        },
        body: '{"categories":["news"],"author":"tester","sort":["created:asc"],"tags":["romance"],"draft":true}',
    },
];

const teardown: (() => void)[] = [];
let browserSent: SentRequest[] = [];

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

beforeEach(() => {
    browserSent = [];
    getBrowserClient().setConfig({ fetch: recordingFetch(browserSent) });
});

afterEach(async () => {
    for (const dispose of teardown.splice(0)) {
        await act(async () => dispose());
    }
    mocks.search = {};
});

async function renderHydrated(search: ArticlesSearch) {
    const { state, serverSent } = await prefetchWithLoader(search);
    const queryClient = appQueryClient();
    hydrate(queryClient, JSON.parse(JSON.stringify(state)));
    mocks.search = search;

    const container = document.createElement('div');
    const root = createRoot(container);
    teardown.push(() => root.unmount());

    await act(async () => {
        root.render(
            <QueryClientProvider client={queryClient}>
                <ArticleList />
            </QueryClientProvider>,
        );
    });
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

    return { container, queryClient, serverSent };
}

describe('articles loader and ArticleList', () => {
    it.each(CASES)('share one list query: $name', async ({ search }) => {
        const { container, queryClient } = await renderHydrated(search);

        expect(browserSent).toEqual([]);
        expect(
            queryClient
                .getQueryCache()
                .findAll({ queryKey: [{ _id: 'getArticles' }] }),
        ).toHaveLength(1);
        expect(
            container.querySelector('[data-slug="first-article"]'),
        ).not.toBeNull();
    });

    it.each(CASES)('sends the list body once from the loader: $name', async ({
        search,
        body,
    }) => {
        const { serverSent } = await renderHydrated(search);

        expect(serverSent.filter(({ path }) => path === '/articles')).toEqual([
            { method: 'POST', path: '/articles', body },
        ]);
    });

    it.each(CASES)('keeps the HEAD component key: $name', async ({
        search,
    }) => {
        const { queryClient } = await renderHydrated(search);
        const [query] = queryClient
            .getQueryCache()
            .findAll({ queryKey: [{ _id: 'getArticles' }] });

        expect(query.queryHash).toBe(
            hashKey(headComponentOptions(search).queryKey),
        );
    });
});

describe('articleListOptions', () => {
    it('keys empty tags like no tags', () => {
        expect(hashKey(articleListOptions({ tags: [] }).queryKey)).toBe(
            hashKey(articleListOptions({}).queryKey),
        );
    });

    it('keys another tag list differently', () => {
        expect(
            hashKey(articleListOptions({ tags: ['romance'] }).queryKey),
        ).not.toBe(hashKey(articleListOptions({}).queryKey));
    });
});
