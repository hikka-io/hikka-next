'use client';

import { ActivityResponse, UserAppearance, UserResponse } from '@hikka/client';
import React from 'react';

import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
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
    return useQuery({
        queryKey: queryKeys.user.search(args),
        queryFn: (client) => client.user.searchUsers(args),
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
    const query = useQuery({
        queryKey: queryKeys.user.me(),
        queryFn: (client) => client.user.getCurrentUser(),
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
    return useQuery({
        queryKey: queryKeys.user.activity(username),
        queryFn: (client) => client.user.getUserActivity(username),
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
    return useQuery({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: (client) => client.user.getUserByUsername(username),
        ...rest,
    });
}

/**
 * Hook for retrieving a user's UI appearance config by username
 */
export function useUserUI<TResult = UserAppearance>({
    username,
    ...rest
}: UseUserUIParams & QueryParams<UserAppearance, TResult>) {
    return useQuery<UserAppearance, Error, TResult>({
        queryKey: queryKeys.user.ui(username),
        queryFn: (client) => client.user.getUserUI(username),
        ...rest,
    });
}

/**
 * Hook for updating a user's UI appearance config
 */
export const useUpdateUserUI = createMutation<
    UserAppearance,
    Error,
    { username: string; appearance: UserAppearance }
>({
    mutationFn: (client, { username, appearance }) =>
        client.user.updateUserUI(username, appearance),
    invalidateQueries: ({ username }) => queryKeys.user.ui(username),
});
