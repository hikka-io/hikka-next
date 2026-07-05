import type { QueryClient } from '@tanstack/react-query';

import { authInfoQueryKey, profileQueryKey, setAuthToken } from '@hikka/api';

import { setAuthCookieFn } from '@/utils/auth';

/**
 * Shared success path for the login / signup / password-reset forms: persist
 * the auth secret to the cookie and browser client, then invalidate the
 * profile and auth-info queries so the app reflects the new session.
 */
export async function handleAuthSuccess(
    secret: string,
    queryClient: QueryClient,
) {
    await setAuthCookieFn({ data: { secret } });
    setAuthToken(secret);
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileQueryKey() }),
        queryClient.invalidateQueries({ queryKey: authInfoQueryKey() }),
    ]);
}
