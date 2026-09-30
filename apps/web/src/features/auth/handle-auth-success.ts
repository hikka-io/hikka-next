import type { QueryClient } from '@tanstack/react-query';

import { setAuthToken } from '@hikka/api';

import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { setAuthCookieFn } from '@/utils/cookies';

/**
 * Shared success path for the login / signup / password-reset forms: persist
 * the auth secret to the cookie and browser client, then invalidate the
 * profile query so the app reflects the new session.
 */
export async function handleAuthSuccess(
    secret: string,
    queryClient: QueryClient,
) {
    await setAuthCookieFn({ data: { secret } });
    setAuthToken(secret);
    await invalidateSession(queryClient);
}
