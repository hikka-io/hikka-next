import { hashKey, QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    createRequestClient,
    type EditContentTypeEnum,
    type EditStatusEnum,
    getEditsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import { type EditSearch, editSearchSchema } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

import { Route } from '../../routes/_pages/edit/index';
import { editListOptions } from './queries';

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

// Copy of the list query HEAD built in edit-list.tsx.
function componentOptions(search: EditSearch) {
    return paginatedInfiniteOptions(
        getEditsInfiniteOptions({
            body: {
                content_type:
                    (search.content_type as EditContentTypeEnum) || undefined,
                sort: expandSort('edit', search.sort, search.order),
                status: (search.edit_status as EditStatusEnum) || undefined,
                author: search.author,
                moderator: search.moderator,
            },
        }),
        Number(search.page || 1),
    );
}

const CASES: { name: string; raw: Record<string, unknown> }[] = [
    { name: 'no filters', raw: { page: 1 } },
    { name: 'author', raw: { page: 1, author: 'tester' } },
    { name: 'moderator', raw: { page: 1, moderator: 'mod' } },
    {
        name: 'every filter',
        raw: {
            page: 3,
            content_type: 'anime',
            edit_status: 'pending',
            author: 'tester',
            moderator: 'mod',
            sort: 'created',
            order: 'asc',
        },
    },
];

describe('editListOptions', () => {
    it.each(CASES)('keeps the component key: $name', ({ raw }) => {
        const search = editSearchSchema.parse(raw);

        expect(hashKey(editListOptions(search).queryKey)).toBe(
            hashKey(componentOptions(search).queryKey),
        );
    });

    it.each(CASES)('ignores the request client: $name', ({ raw }) => {
        const search = editSearchSchema.parse(raw);
        const client = createRequestClient({
            baseUrl: BASE_URL,
            internalBaseUrl: 'http://backend:8000',
        });

        expect(hashKey(editListOptions(search, client).queryKey)).toBe(
            hashKey(editListOptions(search).queryKey),
        );
    });

    it('keys author and moderator', () => {
        const plain = hashKey(editListOptions({ page: 1 }).queryKey);

        expect(
            hashKey(editListOptions({ page: 1, author: 'tester' }).queryKey),
        ).not.toBe(plain);
        expect(
            hashKey(editListOptions({ page: 1, moderator: 'mod' }).queryKey),
        ).not.toBe(plain);
    });
});

describe('edit list route', () => {
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

    it('redirects to page 1 from beforeLoad and keeps the filters', () => {
        expect(redirectFor({ author: 'tester' })).toMatchObject({
            to: '/edit',
            search: { author: 'tester', page: 1 },
        });
    });

    it('does not redirect when the page is set', () => {
        expect(redirectFor({ page: 2 })).toBeUndefined();
    });

    it.each(CASES)(
        'prefetches the component key from the loader: $name',
        async ({ raw }) => {
            const search = editSearchSchema.parse(raw);
            const queryClient = new QueryClient();
            const hashes: string[] = [];
            Object.assign(queryClient, {
                prefetchInfiniteQuery: vi.fn(
                    async (options: { queryKey: readonly unknown[] }) => {
                        hashes.push(hashKey(options.queryKey));
                    },
                ),
            });
            const loader = Route.options.loader as (
                ctx: unknown,
            ) => Promise<unknown>;

            await loader({
                deps: search,
                context: {
                    queryClient,
                    apiClient: createRequestClient({
                        baseUrl: BASE_URL,
                        internalBaseUrl: 'http://backend:8000',
                    }),
                },
            });

            expect(hashes).toContain(
                hashKey(componentOptions(search).queryKey),
            );
        },
    );

    it('skips every prefetch on a hover preload', async () => {
        const queryClient = new QueryClient();
        const prefetchInfiniteQuery = vi.fn(async () => {});
        Object.assign(queryClient, { prefetchInfiniteQuery });
        const loader = Route.options.loader as (
            ctx: unknown,
        ) => Promise<unknown>;

        await loader({
            deps: editSearchSchema.parse({ page: 1 }),
            preload: true,
            context: { queryClient, apiClient: undefined },
        });

        expect(prefetchInfiniteQuery).not.toHaveBeenCalled();
    });
});
