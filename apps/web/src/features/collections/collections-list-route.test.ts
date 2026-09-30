import { QueryClient } from '@tanstack/react-query';
import {
    createMemoryHistory,
    createRootRouteWithContext,
    createRoute,
    createRouter,
    isRedirect,
} from '@tanstack/react-router';
import { describe, expect, it, vi } from 'vitest';

import { Route } from '../../routes/_pages/collections/index';

const PAGINATION = { page: 1, pages: 4, total: 60 };

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

type LoaderOptions = {
    handler: (ctx: unknown) => Promise<unknown>;
    staleReloadMode: string;
};

async function runLoader(deps: object, preload = false) {
    const queryClient = new QueryClient();
    const ensureInfiniteQueryData = vi.fn(async () => ({
        pages: [{ list: [], pagination: PAGINATION }],
        pageParams: [1],
    }));
    Object.assign(queryClient, { ensureInfiniteQueryData });
    const loader = Route.options.loader as unknown as LoaderOptions;
    const data = await loader.handler({
        deps,
        preload,
        context: { queryClient, apiClient: undefined },
    });
    return { data, ensureInfiniteQueryData };
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

    it('has no redirect in the loader and returns only pagination', async () => {
        const { data, ensureInfiniteQueryData } = await runLoader({});

        expect(ensureInfiniteQueryData).toHaveBeenCalledTimes(1);
        expect(data).toMatchObject({
            sort: 'system_ranking',
            pagination: PAGINATION,
        });
    });

    it('returns the page and sort from the search', async () => {
        const { data } = await runLoader({ page: 3, sort: 'created' });

        expect(data).toEqual({
            page: 3,
            sort: 'created',
            pagination: PAGINATION,
        });
    });
});

describe('collections list route preload', () => {
    it('skips the list fetch on a preload', async () => {
        const { data, ensureInfiniteQueryData } = await runLoader(
            { page: 1 },
            true,
        );

        expect(ensureInfiniteQueryData).not.toHaveBeenCalled();
        expect(data).toEqual({
            page: 1,
            sort: 'system_ranking',
            pagination: undefined,
        });
    });

    it('reruns a blocking loader on the click that follows a preload', async () => {
        const queryClient = new QueryClient();
        const ensureInfiniteQueryData = vi.fn(async () => {
            await new Promise((resolve) => setTimeout(resolve, 20));
            return {
                pages: [{ list: [], pagination: PAGINATION }],
                pageParams: [1],
            };
        });
        Object.assign(queryClient, { ensureInfiniteQueryData });

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
            preloadStaleTime: Route.options.preloadStaleTime,
            loader: Route.options.loader,
        } as never);
        const router = createRouter({
            routeTree: root.addChildren([home, collections]),
            history: createMemoryHistory({ initialEntries: ['/'] }),
            context: { queryClient, apiClient: undefined },
        });
        await router.load();

        await router.preloadRoute({
            to: '/collections',
            search: { page: 1 },
        } as never);
        expect(ensureInfiniteQueryData).not.toHaveBeenCalled();

        await router.navigate({
            to: '/collections',
            search: { page: 1 },
        } as never);

        expect(ensureInfiniteQueryData).toHaveBeenCalledTimes(1);
        expect(router.state.matches.at(-1)?.loaderData).toMatchObject({
            pagination: PAGINATION,
        });
    });
});
