import { UserResponse } from '@hikka/client';
import React from 'react';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving the current user's profile
 */
export function useSession({ ...rest }: QueryParams<UserResponse> = {}) {
    const query = useQuery({
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getMe(),
        ...rest,
    });

    const isAdmin = React.useCallback(() => {
        return query.data?.role === 'admin';
    }, [query.data]);

    const isModerator = React.useCallback(() => {
        return query.data?.role === 'moderator';
    }, [query.data]);

    const logout = async () => {
        // await deleteCookie('auth');
        // window.location.reload();
        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/logout`;
    };

    return { logout, user: query.data, isAdmin, isModerator };
}

/**
 * Prefetches the current user's profile for server-side rendering
 */
export async function prefetchSession({
    ...rest
}: PrefetchQueryParams<UserResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getMe(),
        ...rest,
    });
}
