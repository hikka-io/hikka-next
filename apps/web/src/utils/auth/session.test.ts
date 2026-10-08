import { QueryClient } from '@tanstack/react-query';
import { beforeAll, describe, expect, it } from 'vitest';

import {
    configureBrowserClient,
    createRequestClient,
    getBrowserClient,
    HikkaApiError,
    type ProfileResponse,
    profileOptions,
    profileQueryKey,
} from '@hikka/api';

import { PUBLIC_API_URL } from '@/utils/api/base-url';

import { getSessionFromPagesCache, isDeadSessionError } from './session';

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

function ssrRequestClient() {
    return createRequestClient({
        baseUrl: PUBLIC_API_URL,
        internalBaseUrl: 'http://backend:8000',
        authToken: 'token',
    });
}

beforeAll(() => {
    configureBrowserClient({ baseUrl: PUBLIC_API_URL });
});

describe('profileQueryKey', () => {
    it('equals the key the /_pages beforeLoad ensures with the SSR request client', () => {
        expect(profileOptions({ client: ssrRequestClient() }).queryKey).toEqual(
            profileQueryKey(),
        );
    });

    it('equals the key the /_pages beforeLoad ensures with the browser client', () => {
        expect(profileOptions({ client: getBrowserClient() }).queryKey).toEqual(
            profileQueryKey(),
        );
    });

    it('carries the public API URL', () => {
        expect(profileQueryKey()).toEqual([
            { _id: 'profile', baseUrl: PUBLIC_API_URL },
        ]);
    });
});

describe('getSessionFromPagesCache', () => {
    it('returns undefined when the cache has no profile', () => {
        expect(getSessionFromPagesCache(new QueryClient())).toBeUndefined();
    });

    it('returns the cached profile', () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(profileQueryKey(), PROFILE);

        expect(getSessionFromPagesCache(queryClient)).toEqual(PROFILE);
    });

    it('returns the profile a request client ensured', async () => {
        const client = createRequestClient({
            baseUrl: PUBLIC_API_URL,
            authToken: 'token',
        });
        client.setConfig({ fetch: async () => Response.json(PROFILE) });
        const queryClient = new QueryClient();

        await queryClient.ensureQueryData(profileOptions({ client }));

        expect(getSessionFromPagesCache(queryClient)).toEqual(PROFILE);
    });
});

describe('isDeadSessionError', () => {
    it.each([
        'auth:invalid_token',
        'auth:token_expired',
        'auth:user_not_found',
    ])('treats %s as a dead session', (code) => {
        expect(isDeadSessionError(new HikkaApiError('', 400, code))).toBe(true);
    });

    it('keeps other errors', () => {
        expect(
            isDeadSessionError(new HikkaApiError('', 400, 'auth:banned')),
        ).toBe(false);
        expect(
            isDeadSessionError(new HikkaApiError('', 500, 'unknown_error')),
        ).toBe(false);
        expect(isDeadSessionError(new Error('auth:token_expired'))).toBe(false);
    });
});
