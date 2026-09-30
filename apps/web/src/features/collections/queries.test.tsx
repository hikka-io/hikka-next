import { renderToStaticMarkup } from 'react-dom/server';

import { hashKey, QueryClient } from '@tanstack/react-query';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, createRequestClient } from '@hikka/api';

import { Route } from '../../routes/_pages/collections/index';
import CollectionList from './collection-list/collection-list';
import { collectionListOptions } from './queries';

type Options = { queryKey: readonly unknown[] };

const mocks = vi.hoisted(() => ({ calls: [] as Options[] }));

vi.mock('@/utils/api/use-infinite-list', () => ({
    useInfiniteList: (options: Options) => {
        mocks.calls.push(options);
        return { list: undefined };
    },
}));

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

type LoaderOptions = { handler: (ctx: unknown) => Promise<unknown> };

async function loaderKey(deps: object) {
    const keys: Options['queryKey'][] = [];
    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        ensureInfiniteQueryData: vi.fn(async (options: Options) => {
            keys.push(options.queryKey);
            return {
                pages: [
                    { list: [], pagination: { page: 1, pages: 1, total: 0 } },
                ],
                pageParams: [1],
            };
        }),
    });

    const data = (await (
        Route.options.loader as unknown as LoaderOptions
    ).handler({
        deps,
        preload: false,
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: BASE_URL,
                internalBaseUrl: 'http://backend:8000',
            }),
        },
    })) as { page: number; sort: 'system_ranking' | 'created' };

    return { key: keys[0], data };
}

describe('collectionListOptions', () => {
    it.each([{ page: 1 }, { page: 3 }, { page: 2, sort: 'created' as const }])(
        'keys the loader like the list: %o',
        async (deps) => {
            mocks.calls = [];
            const { key, data } = await loaderKey(deps);

            renderToStaticMarkup(
                <CollectionList page={data.page} sort={data.sort} />,
            );

            expect(hashKey(key)).toBe(hashKey(mocks.calls[0].queryKey));
        },
    );

    it('keys every page and sort apart', () => {
        const first = hashKey(collectionListOptions({ page: 1 }).queryKey);

        expect(hashKey(collectionListOptions({ page: 2 }).queryKey)).not.toBe(
            first,
        );
        expect(
            hashKey(
                collectionListOptions({ page: 1, sort: 'created' }).queryKey,
            ),
        ).not.toBe(first);
    });
});
