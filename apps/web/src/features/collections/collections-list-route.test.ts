import { QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
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

async function runLoader(deps: object) {
    const queryClient = new QueryClient();
    const ensureInfiniteQueryData = vi.fn(async () => ({
        pages: [{ list: [], pagination: PAGINATION }],
        pageParams: [1],
    }));
    Object.assign(queryClient, { ensureInfiniteQueryData });
    const loader = Route.options.loader as (ctx: unknown) => Promise<unknown>;
    const data = await loader({
        deps,
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
