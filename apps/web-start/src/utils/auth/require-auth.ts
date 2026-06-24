import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';

import { queryKeys } from '@hikka/react/core';

/**
 * Call in beforeLoad to require an authenticated session.
 * Assumes the parent _pages loader has already prefetched the session.
 * Redirects to /login if no session data exists.
 */
export function requireAuth(queryClient: QueryClient, redirectTo = '/login') {
    const session = queryClient.getQueryData(queryKeys.user.me());
    if (!session) {
        throw redirect({ to: redirectTo });
    }
    return session;
}
