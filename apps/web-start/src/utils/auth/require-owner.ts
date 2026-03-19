import { UserResponse, UserRoleEnum } from '@hikka/client';
import { queryKeys } from '@hikka/react/core';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';

/**
 * Call in beforeLoad to require the current user to be the content author,
 * or an admin/moderator. Assumes the parent loader has already cached the
 * content data and the _pages loader has prefetched the session.
 *
 * @param authorUsername - The username of the content author
 * @param redirectTo - Where to redirect unauthorized users (default: '/')
 */
export function requireOwner(
    queryClient: QueryClient,
    authorUsername: string,
    redirectTo = '/',
) {
    const session = queryClient.getQueryData<UserResponse>(queryKeys.user.me());

    if (!session) {
        throw redirect({ to: '/login' });
    }

    const isPrivileged =
        session.role === UserRoleEnum.ADMIN ||
        session.role === UserRoleEnum.MODERATOR;

    if (session.username !== authorUsername && !isPrivileged) {
        throw redirect({ to: redirectTo });
    }

    return session;
}
