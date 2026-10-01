import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import {
    animeSlugQueryKey,
    genresQueryKey,
    getCollectionsQueryKey,
    getFavouriteQueryKey,
    profileQueryKey,
    searchAnimeQueryKey,
    userProfileQueryKey,
    watchGetQueryKey,
} from '@hikka/api';

import { handleAuthSuccess } from './handle-auth-success';

const mocks = vi.hoisted(() => ({
    setAuthCookieFn: vi.fn(async () => {}),
    setAuthToken: vi.fn(),
}));

vi.mock('@/utils/cookies', () => ({
    setAuthCookieFn: mocks.setAuthCookieFn,
}));

vi.mock('@hikka/api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hikka/api')>()),
    setAuthToken: mocks.setAuthToken,
}));

describe('handleAuthSuccess', () => {
    it('persists the secret and invalidates the profile query', async () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(profileQueryKey(), { username: 'old' });

        await handleAuthSuccess('secret', queryClient);

        expect(mocks.setAuthCookieFn).toHaveBeenCalledWith({
            data: { secret: 'secret' },
        });
        expect(mocks.setAuthToken).toHaveBeenCalledWith('secret');
        expect(
            queryClient.getQueryState(profileQueryKey())?.isInvalidated,
        ).toBe(true);
    });

    it('stale-marks the queries cached for the anonymous visitor', async () => {
        const queryClient = new QueryClient();
        const slug = { path: { slug: 'frieren' } };
        const perUser = [
            animeSlugQueryKey(slug),
            searchAnimeQueryKey({ body: {} }),
            getCollectionsQueryKey({ body: {} }),
            watchGetQueryKey(slug),
            getFavouriteQueryKey({
                path: { content_type: 'anime', slug: 'frieren' },
            }),
            userProfileQueryKey({ path: { username: 'author' } }),
        ];
        const shared = [genresQueryKey(), ['other']];
        for (const key of [...perUser, ...shared]) {
            queryClient.setQueryData(key, {});
        }

        await handleAuthSuccess('secret', queryClient);

        expect(
            perUser.map((key) => queryClient.getQueryState(key)?.isInvalidated),
        ).toEqual(perUser.map(() => true));
        expect(
            shared.map((key) => queryClient.getQueryState(key)?.isInvalidated),
        ).toEqual([false, false]);
    });
});
