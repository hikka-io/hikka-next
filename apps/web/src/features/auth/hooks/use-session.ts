import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    getAuthToken,
    type ProfileResponse,
    profileOptions,
    UserRoleEnum,
} from '@hikka/api';

/** Narrows the API-nullable `username`/`role`, which an authenticated session always carries. */
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
