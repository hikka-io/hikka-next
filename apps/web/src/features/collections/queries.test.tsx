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

type Loader = (ctx: unknown) => Promise<unknown>;

async function loaderKey(deps: { page: number; sort?: 'created' }) {
    const keys: Options['queryKey'][] = [];
    const queryClient = new QueryClient();
    Object.assign(queryClient, {
        prefetchInfiniteQuery: vi.fn(async (options: Options) => {
            keys.push(options.queryKey);
        }),
    });

    await (Route.options.loader as unknown as Loader)({
        deps,
        preload: false,
        context: {
            queryClient,
            apiClient: createRequestClient({
                baseUrl: BASE_URL,
                internalBaseUrl: 'http://backend:8000',
            }),
        },
    });

    return keys[0];
}

describe('collectionListOptions', () => {
    it.each([{ page: 1 }, { page: 3 }, { page: 2, sort: 'created' as const }])(
        'keys the loader like the list: %o',
        async (deps) => {
            mocks.calls = [];
            const key = await loaderKey(deps);

            renderToStaticMarkup(
                <CollectionList
                    page={deps.page}
                    sort={deps.sort ?? 'system_ranking'}
                />,
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
