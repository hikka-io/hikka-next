import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { profileQueryKey } from '@hikka/api';

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
    it('persists the secret and invalidates only the profile query', async () => {
        const queryClient = new QueryClient();
        queryClient.setQueryData(profileQueryKey(), { username: 'old' });
        queryClient.setQueryData(['other'], 'kept');

        await handleAuthSuccess('secret', queryClient);

        expect(mocks.setAuthCookieFn).toHaveBeenCalledWith({
            data: { secret: 'secret' },
        });
        expect(mocks.setAuthToken).toHaveBeenCalledWith('secret');
        expect(
            queryClient.getQueryState(profileQueryKey())?.isInvalidated,
        ).toBe(true);
        expect(queryClient.getQueryState(['other'])?.isInvalidated).toBe(false);
    });
});
