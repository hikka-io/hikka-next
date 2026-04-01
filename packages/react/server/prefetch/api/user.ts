import {
    searchUsersOptions,
    sessionOptions,
    sessionUserUIOptions,
    userActivityOptions,
    userByUsernameOptions,
    userUIOptions,
} from '@/options/api/user';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseUserActivityParams,
    UseUserByUsernameParams,
    UseUserSearchParams,
    UseUserUIParams,
} from '@/types/user';

/**
 * Prefetches user search results for server-side rendering
 */
export async function prefetchSearchUsers({
    args,
    ...rest
}: PrefetchQueryParams & UseUserSearchParams) {
    return prefetchQuery({
        optionsFactory: (client) => searchUsersOptions(client, { args }),
        ...rest,
    });
}

/**
 * Prefetches the current user's profile for server-side rendering
 */
export async function prefetchSession({ ...rest }: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => sessionOptions(client),
        ...rest,
    });
}

/**
 * Prefetches a user's activity for server-side rendering
 */
export async function prefetchUserActivity({
    username,
    ...rest
}: PrefetchQueryParams & UseUserActivityParams) {
    return prefetchQuery({
        optionsFactory: (client) => userActivityOptions(client, { username }),
        ...rest,
    });
}

/**
 * Prefetches a user profile by username for server-side rendering
 */
export async function prefetchUserByUsername({
    username,
    ...rest
}: PrefetchQueryParams & UseUserByUsernameParams) {
    return prefetchQuery({
        optionsFactory: (client) => userByUsernameOptions(client, { username }),
        ...rest,
    });
}

/**
 * Prefetches a user's UI config by username for server-side rendering
 */
export async function prefetchUserUI({
    username,
    ...rest
}: PrefetchQueryParams & UseUserUIParams) {
    return prefetchQuery({
        optionsFactory: (client) => userUIOptions(client, { username }),
        ...rest,
    });
}

/**
 * Prefetches the current user's UI config for server-side rendering
 */
export async function prefetchSessionUserUI({ ...rest }: PrefetchQueryParams) {
    return prefetchQuery({
        optionsFactory: (client) => sessionUserUIOptions(client),
        ...rest,
    });
}
