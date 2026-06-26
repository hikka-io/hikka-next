import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    getAuthToken,
    profileOptions,
    type ProfileResponse,
    UserRoleEnum,
} from '@hikka/api';

/**
 * Session user shape. The generated `@hikka/api` widens `username`/`role` to
 * nullable/`string`, but an authenticated session always carries them; narrow
 * here so consumers keep the ergonomics the previous session hook had.
 */
export type SessionUser = Omit<ProfileResponse, 'username' | 'role'> & {
    username: string;
    role: UserRoleEnum;
};

export function useSession(opts?: { enabled?: boolean }) {
    const query = useQuery({
        ...profileOptions(),
        enabled: !!getAuthToken() && (opts?.enabled ?? true),
    });

    const user = query.data as SessionUser | undefined;

    const isAdmin = useCallback(
        () => user?.role === UserRoleEnum.ADMIN,
        [user],
    );
    const isModerator = useCallback(
        () =>
            user?.role === UserRoleEnum.ADMIN ||
            user?.role === UserRoleEnum.MODERATOR,
        [user],
    );

    return { ...query, user, isAdmin, isModerator };
}
