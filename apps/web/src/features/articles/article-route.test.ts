import { QueryClient } from '@tanstack/react-query';
import { isNotFound, isRedirect } from '@tanstack/react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    createRequestClient,
    getArticleOptions,
    HikkaApiError,
    profileQueryKey,
    type UserResponse,
} from '@hikka/api';

import { Route } from '../../routes/_pages/articles/$slug';
import { Route as UpdateRoute } from '../../routes/_pages/articles/$slug/update';

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

type Loader = (ctx: unknown) => Promise<unknown>;

function runLoader(ensureQueryData: () => Promise<unknown>) {
    const queryClient = new QueryClient();
    Object.assign(queryClient, { ensureQueryData: vi.fn(ensureQueryData) });

    return (Route.options.loader as Loader)({
        params: { slug: 'test-article' },
        context: {
            queryClient,
            apiClient: createRequestClient({ baseUrl: BASE_URL }),
        },
    });
}

describe('article layout loader', () => {
    it('returns the article for head', async () => {
        await expect(
            runLoader(async () => ({ slug: 'test-article' })),
        ).resolves.toEqual({ article: { slug: 'test-article' } });
    });

    it('maps a 404 to notFound', async () => {
        const error = await runLoader(async () => {
            throw new HikkaApiError('Not found', 404, 'system:not_found');
        }).catch((thrown: unknown) => thrown);

        expect(isNotFound(error)).toBe(true);
    });
});

describe('article update freshness', () => {
    function setup(author: string) {
        const queryClient = new QueryClient();
        queryClient.setQueryData(profileQueryKey(), {
            username: 'owner',
            role: 'user',
        } as UserResponse);
        const { queryKey } = getArticleOptions({
            path: { slug: 'test-article' },
        });
        queryClient.setQueryData(queryKey, {
            author: { username: 'owner' },
            title: 'Old',
        } as never);
        const fetchQuery = queryClient.fetchQuery.bind(queryClient);
        const queryFn = vi.fn(async () => ({
            author: { username: author },
            title: 'New',
        }));
        Object.assign(queryClient, {
            fetchQuery: (options: Parameters<typeof fetchQuery>[0]) =>
                fetchQuery({ ...options, queryFn }),
        });
        return { queryClient, queryKey, queryFn };
    }

    const beforeLoad = (queryClient: QueryClient) =>
        (UpdateRoute.options.beforeLoad as Loader)({
            params: { slug: 'test-article' },
            context: {
                queryClient,
                apiClient: createRequestClient({ baseUrl: BASE_URL }),
            },
        });

    it('revalidates a fresh cached article before the editor seeds from it', async () => {
        const { queryClient, queryKey, queryFn } = setup('owner');

        await beforeLoad(queryClient);

        expect(queryFn).toHaveBeenCalledTimes(1);
        expect(queryClient.getQueryData(queryKey)).toMatchObject({
            title: 'New',
        });
    });

    it('guards the owner on the fresh author', async () => {
        const { queryClient } = setup('someone');
        const error = await beforeLoad(queryClient).catch(
            (thrown: unknown) => thrown,
        );

        expect(isRedirect(error)).toBe(true);
    });
});
