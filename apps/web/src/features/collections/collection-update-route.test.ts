import { hashKey, QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
    configureBrowserClient,
    createRequestClient,
    getCollectionOptions,
    profileQueryKey,
    type UserResponse,
} from '@hikka/api';

import { Route } from '../../routes/_pages/collections/$reference/update';

const BASE_URL = 'https://api.example.test';

beforeAll(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

function setup(role: string, entity: unknown) {
    const queryClient = new QueryClient();
    queryClient.setQueryData(profileQueryKey(), {
        username: 'owner',
        role,
    } as UserResponse);
    const ensured: unknown[][] = [];
    const fetchQuery = vi.fn(
        async (options: {
            queryKey: readonly unknown[];
            staleTime?: number;
        }) => {
            ensured.push([...options.queryKey]);
            expect(options.staleTime).toBe(0);
            if (entity instanceof Error) throw entity;
            queryClient.setQueryData(options.queryKey, entity);
            return entity;
        },
    );
    Object.assign(queryClient, { fetchQuery });
    return { queryClient, ensured };
}

async function redirectFor(queryClient: QueryClient) {
    const beforeLoad = Route.options.beforeLoad as (
        ctx: unknown,
    ) => Promise<unknown>;
    try {
        await beforeLoad({
            params: { reference: 'abc' },
            context: {
                queryClient,
                apiClient: createRequestClient({ baseUrl: BASE_URL }),
            },
        });
    } catch (error) {
        if (isRedirect(error)) return error.options;
        throw error;
    }
    return undefined;
}

describe('collection update owner guard on a cold cache', () => {
    it('lets the author in after ensuring the collection', async () => {
        const { queryClient, ensured } = setup('user', {
            author: { username: 'owner' },
        });

        expect(await redirectFor(queryClient)).toBeUndefined();
        expect(ensured).toHaveLength(1);
        expect(hashKey(ensured[0])).toBe(
            hashKey(
                getCollectionOptions({ path: { reference: 'abc' } }).queryKey,
            ),
        );
    });

    it('redirects a non-privileged user who is not the author', async () => {
        const { queryClient } = setup('user', {
            author: { username: 'someone' },
        });

        expect(await redirectFor(queryClient)).toMatchObject({
            to: '/collections/abc',
        });
    });

    it('lets an admin in', async () => {
        const { queryClient } = setup('admin', {
            author: { username: 'someone' },
        });

        expect(await redirectFor(queryClient)).toBeUndefined();
    });

    it('redirects when the collection cannot be loaded', async () => {
        const { queryClient } = setup('user', new Error('boom'));

        expect(await redirectFor(queryClient)).toMatchObject({
            to: '/collections/abc',
        });
    });
});

describe('collection update freshness', () => {
    it('revalidates a fresh cached collection before the editor seeds from it', async () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(profileQueryKey(), {
            username: 'owner',
            role: 'user',
        } as UserResponse);
        const { queryKey } = getCollectionOptions({
            path: { reference: 'abc' },
        });
        queryClient.setQueryData(queryKey, {
            author: { username: 'owner' },
            title: 'Old',
        } as never);
        const fetchQuery = queryClient.fetchQuery.bind(queryClient);
        const queryFn = vi.fn(async () => ({
            author: { username: 'owner' },
            title: 'New',
        }));
        Object.assign(queryClient, {
            fetchQuery: (options: Parameters<typeof fetchQuery>[0]) =>
                fetchQuery({ ...options, queryFn }),
        });

        expect(await redirectFor(queryClient)).toBeUndefined();
        expect(queryFn).toHaveBeenCalledTimes(1);
        expect(queryClient.getQueryData(queryKey)).toMatchObject({
            title: 'New',
        });
    });
});
