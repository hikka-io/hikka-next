'use client';

import { ActivityResponse, UserResponse, UserUI } from '@hikka/client';
import React from 'react';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { QueryParams, useQuery } from '@/client/useQuery';
import {
    searchUsersOptions,
    sessionOptions,
    sessionUserUIOptions,
    userActivityOptions,
    userByUsernameOptions,
    userUIOptions,
} from '@/options/api/user';
import {
    UseSessionParams,
    UseUserActivityParams,
    UseUserByUsernameParams,
    UseUserSearchParams,
    UseUserUIParams,
} from '@/types/user';

/**
 * Hook for searching users
 */
export function useSearchUsers({
    args,
    ...rest
}: UseUserSearchParams & QueryParams<UserResponse[]>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...searchUsersOptions(client, { args }),
        ...rest,
    });
}

/**
 * Hook for retrieving the current user's profile
 */
export function useSession({
    options,
    ...rest
}: QueryParams<UserResponse> & UseSessionParams = {}) {
    const { client } = useHikkaClient();
    const query = useQuery({
        ...sessionOptions(client),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });

    const isAdmin = React.useCallback(() => {
        return query.data?.role === 'admin';
    }, [query.data]);

    const isModerator = React.useCallback(() => {
        return query.data?.role === 'moderator';
    }, [query.data]);

    return { user: query.data, isAdmin, isModerator };
}

/**
 * Hook for retrieving a user's activity
 */
export function useUserActivity({
    username,
    ...rest
}: UseUserActivityParams & QueryParams<ActivityResponse[]>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...userActivityOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for retrieving a user profile by username
 */
export function useUserByUsername({
    username,
    ...rest
}: UseUserByUsernameParams) {
    const { client } = useHikkaClient();
    return useQuery({
        ...userByUsernameOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for retrieving a user's UI config by username
 */
export function useUserUI<TResult = UserUI>({
    username,
    ...rest
}: UseUserUIParams & QueryParams<UserUI, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<UserUI, Error, TResult>({
        ...userUIOptions(client, { username }),
        ...rest,
    });
}

/**
 * Hook for retrieving a user's UI config by username
 */
export function useSessionUserUI<TResult = UserUI>({
    options,
    ...rest
}: QueryParams<UserUI, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<UserUI, Error, TResult>({
        ...sessionUserUIOptions(client),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}
