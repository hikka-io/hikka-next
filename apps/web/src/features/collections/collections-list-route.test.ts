import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
import {
    createMemoryHistory,
    createRootRouteWithContext,
    createRoute,
    createRouter,
    isRedirect,
} from '@tanstack/react-router';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient } from '@hikka/api';

import { Route } from '../../routes/_pages/collections/index';
import CollectionList from './collection-list/collection-list';
import { collectionListOptions } from './queries';

const PAGINATION = { page: 1, pages: 4, total: 60 };

const mocks = vi.hoisted(() => ({
    pagination: undefined as { page: number; pages: number } | undefined,
}));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: () => ({ list: [], pagination: mocks.pagination }),
}));

vi.mock('@/components/page-pagination', () => ({
    default: ({ pagination }: { pagination: { page: number } }) =>
        createElement('nav', { 'data-page': pagination.page }),
}));

beforeAll(() => {
    configureBrowserClient({ baseUrl: 'https://api.example.test' });
});

beforeEach(() => {
    mocks.pagination = undefined;
});

function redirectFor(search: object) {
    const beforeLoad = Route.options.beforeLoad as (ctx: object) => unknown;
    try {
        beforeLoad({ search });
    } catch (error) {
        if (isRedirect(error)) return error.options;
        throw error;
    }
    return undefined;
}

type Loader = (ctx: unknown) => Promise<unknown>;

async function runLoader(deps: object, preload = false) {
    const queryClient = new QueryClient();
    const prefetchInfiniteQuery = vi.fn(async () => {});
    Object.assign(queryClient, { prefetchInfiniteQuery });
    const data = await (Route.options.loader as unknown as Loader)({
        deps,
        preload,
        context: { queryClient, apiClient: undefined },
    });
    return { data, prefetchInfiniteQuery };
}

describe('collections list route', () => {
    it('redirects to page 1 from beforeLoad and keeps the sort', () => {
        expect(redirectFor({ sort: 'created' })).toMatchObject({
            to: '/collections',
            search: { sort: 'created', page: 1 },
        });
        expect(redirectFor({})).toMatchObject({
            to: '/collections',
            search: { page: 1 },
        });
    });

    it('does not redirect when the page is set', () => {
        expect(redirectFor({ page: 2 })).toBeUndefined();
    });

    it('prefetches the list of the search and returns no loader data', async () => {
        const { data, prefetchInfiniteQuery } = await runLoader({
            page: 3,
            sort: 'created',
        });

        expect(data).toBeUndefined();
        expect(prefetchInfiniteQuery).toHaveBeenCalledTimes(1);
        const [[options]] = prefetchInfiniteQuery.mock.calls as unknown as [
            [{ queryKey: readonly unknown[] }],
        ];
        expect(hashKey(options.queryKey)).toBe(
            hashKey(
                collectionListOptions({ page: 3, sort: 'created' }).queryKey,
            ),
        );
    });

    it('keeps the default preload stale time', () => {
        expect(Route.options.preloadStaleTime).toBeUndefined();
    });
});

describe('collections list route preload', () => {
    it('skips the list fetch on a preload', async () => {
        const { data, prefetchInfiniteQuery } = await runLoader(
            { page: 1 },
            true,
        );

        expect(prefetchInfiniteQuery).not.toHaveBeenCalled();
        expect(data).toBeUndefined();
    });

    it('waits for the list on a navigation without a preload', async () => {
        const queryClient = new QueryClient();
        let resolve!: () => void;
        const prefetchInfiniteQuery = vi.fn(
            () => new Promise<void>((done) => (resolve = done)),
        );
        Object.assign(queryClient, { prefetchInfiniteQuery });

        const root = createRootRouteWithContext<{
            queryClient: QueryClient;
            apiClient: undefined;
        }>()();
        const home = createRoute({ getParentRoute: () => root, path: '/' });
        const collections = createRoute({
            getParentRoute: () => root,
            path: '/collections',
            validateSearch: Route.options.validateSearch,
            loaderDeps: Route.options.loaderDeps,
            loader: Route.options.loader,
        } as never);
        const router = createRouter({
            routeTree: root.addChildren([home, collections]),
            history: createMemoryHistory({ initialEntries: ['/'] }),
            context: { queryClient, apiClient: undefined },
        });
        await router.load();

        let settled = false;
        const navigation = router
            .navigate({ to: '/collections', search: { page: 2 } } as never)
            .then(() => {
                settled = true;
            });
        await new Promise((done) => setTimeout(done, 10));

        expect(prefetchInfiniteQuery).toHaveBeenCalledTimes(1);
        expect(settled).toBe(false);

        resolve();
        await navigation;
        expect(router.state.location.search).toMatchObject({ page: 2 });
    });
});

describe('CollectionList pagination', () => {
    it('renders the pagination of the loaded page', () => {
        mocks.pagination = PAGINATION;

        expect(
            renderToStaticMarkup(
                createElement(CollectionList, {
                    page: 1,
                    sort: 'system_ranking',
                }),
            ),
        ).toContain('data-page="1"');
    });

    it('renders no pagination before the list loads', () => {
        expect(
            renderToStaticMarkup(
                createElement(CollectionList, {
                    page: 1,
                    sort: 'system_ranking',
                }),
            ),
        ).not.toContain('<nav');
    });
});
