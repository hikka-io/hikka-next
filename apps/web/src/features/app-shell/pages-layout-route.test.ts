import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    type Client,
    configureBrowserClient,
    getBrowserClient,
    type ProfileResponse,
    profileOptions,
    setAuthToken,
} from '@hikka/api';

import { getAuthTokenFn } from '@/utils/cookies/server';

import { Route } from '../../routes/_pages';

const cookies = vi.hoisted(() => ({ authToken: null as string | null }));

vi.mock('@/utils/cookies/server', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/utils/cookies/server')>()),
    getAuthTokenFn: vi.fn(async () => cookies.authToken),
}));

const BASE_URL = 'https://api.example.test';

const PROFILE: ProfileResponse = {
    reference: '7d2f6a4e-1c3b-4b8e-9f0a-5e6d7c8b9a01',
    updated: null,
    created: 1700000000,
    description: null,
    username: 'tester',
    cover: null,
    active: true,
    avatar: 'https://cdn.example.test/avatar.jpg',
    role: 'user',
    email: 'tester@example.test',
};

const fetchMock = vi.fn(async (input: Request | string | URL) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url.endsWith('/notifications/count')) {
        return Response.json({ unseen: 2 });
    }
    return Response.json({ code: 'unexpected', message: url }, { status: 500 });
});

let queryClient: QueryClient;
let apiClient: Client;

const requestedUrls = () =>
    fetchMock.mock.calls.map(([input]) =>
        input instanceof Request ? input.url : String(input),
    );

const runBeforeLoad = () =>
    (
        Route.options.beforeLoad as (ctx: {
            context: { queryClient: QueryClient; apiClient: Client };
        }) => Promise<void>
    )({ context: { queryClient, apiClient } });

const runLoader = () =>
    (
        Route.options.loader as (ctx: {
            context: { queryClient: QueryClient; apiClient: Client };
        }) => Promise<void>
    )({ context: { queryClient, apiClient } });

beforeEach(() => {
    cookies.authToken = null;
    vi.stubGlobal('fetch', fetchMock);
    configureBrowserClient({ baseUrl: BASE_URL });
    setAuthToken(undefined);
    apiClient = getBrowserClient();
    queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

describe('_pages route on the client', () => {
    it('skips the auth round trip and every request for an anonymous visitor', async () => {
        await runBeforeLoad();
        await runLoader();

        expect(getAuthTokenFn).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('takes the token from the browser client instead of a server function', async () => {
        setAuthToken('session-token');
        queryClient.setQueryData(
            profileOptions({ client: apiClient }).queryKey,
            PROFILE,
        );

        await runBeforeLoad();
        await runLoader();

        expect(getAuthTokenFn).not.toHaveBeenCalled();
        expect(requestedUrls()).toStrictEqual([
            `${BASE_URL}/notifications/count`,
        ]);
    });

    it('does not prefetch the notifications list', async () => {
        setAuthToken('session-token');
        queryClient.setQueryData(
            profileOptions({ client: apiClient }).queryKey,
            PROFILE,
        );

        await runLoader();

        expect(
            requestedUrls().filter((url) => !url.endsWith('/count')),
        ).toStrictEqual([]);
    });
});

describe('_pages route on the server', () => {
    it('reads the request cookie in process', async () => {
        vi.stubGlobal('window', undefined);
        cookies.authToken = 'cookie-token';
        queryClient.setQueryData(
            profileOptions({ client: apiClient }).queryKey,
            PROFILE,
        );

        await runBeforeLoad();
        await runLoader();

        expect(getAuthTokenFn).toHaveBeenCalledTimes(2);
        expect(requestedUrls()).toStrictEqual([
            `${BASE_URL}/notifications/count`,
        ]);
    });

    it('does nothing without the cookie', async () => {
        vi.stubGlobal('window', undefined);

        await runBeforeLoad();
        await runLoader();

        expect(getAuthTokenFn).toHaveBeenCalledTimes(2);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
