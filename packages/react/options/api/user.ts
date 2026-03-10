import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseUserActivityParams,
    UseUserByUsernameParams,
    UseUserSearchParams,
    UseUserUIParams,
} from '@/types/user';

export function searchUsersOptions(
    client: HikkaClient,
    { args }: UseUserSearchParams,
) {
    return queryOptions({
        queryKey: queryKeys.user.search(args),
        queryFn: () => client.user.searchUsers(args),
    });
}

export function sessionOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.user.me(),
        queryFn: () => client.user.getCurrentUser(),
    });
}

export function userActivityOptions(
    client: HikkaClient,
    { username }: UseUserActivityParams,
) {
    return queryOptions({
        queryKey: queryKeys.user.activity(username),
        queryFn: () => client.user.getUserActivity(username),
    });
}

export function userByUsernameOptions(
    client: HikkaClient,
    { username }: UseUserByUsernameParams,
) {
    return queryOptions({
        queryKey: queryKeys.user.byUsername(username),
        queryFn: () => client.user.getUserByUsername(username),
    });
}

export function userUIOptions(
    client: HikkaClient,
    { username }: UseUserUIParams,
) {
    return queryOptions({
        queryKey: queryKeys.user.ui(username),
        queryFn: () => client.user.getUserUI(username),
    });
}

export function sessionUserUIOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.user.ui('me'),
        queryFn: () => client.user.getCurrentUserUI(),
    });
}
