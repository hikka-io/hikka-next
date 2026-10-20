import type { QueryClient, Updater } from '@tanstack/query-core';

import {
    getIgnoredNotificationsQueryKey,
    type IgnoredNotificationsResponse,
    profileUiQueryKey,
    type UserCustomizationResponse,
} from '@hikka/api';

import {
    type InvalidateOptions,
    invalidateByIds,
    refetchTypeFor,
} from './content-cache';
import { AVATAR_EMBED_IDS, USER_PROFILE_ID } from './query-groups';
import { matchesPath, type QueryId } from './query-id';

const SESSION_IDS: readonly QueryId[] = ['profile'];

/** Invalidate the current-user session/profile query (`profileOptions`). */
export function invalidateSession(
    queryClient: QueryClient,
    options?: InvalidateOptions,
): Promise<void> {
    return invalidateByIds(queryClient, SESSION_IDS, options);
}

/** Refetch one user's public profile (avatar, cover) after they change it and stale-mark the lists that embed the avatar. */
export function invalidateUserProfile(
    queryClient: QueryClient,
    username: string,
    options?: InvalidateOptions,
): Promise<void> {
    return Promise.all([
        queryClient.invalidateQueries({
            predicate: (query) =>
                matchesPath(
                    query.queryKey,
                    USER_PROFILE_ID,
                    'username',
                    username,
                ),
            refetchType: refetchTypeFor(options),
        }),
        invalidateByIds(queryClient, AVATAR_EMBED_IDS, { refetch: false }),
    ]).then(() => undefined);
}

/** Replace the cached ignored-notification types with the saved response. */
export function writeIgnoredNotifications(
    queryClient: QueryClient,
    saved: IgnoredNotificationsResponse,
): void {
    queryClient.setQueryData(getIgnoredNotificationsQueryKey(), saved);
}

/** Write the viewer's UI customization: an optimistic patch or a rollback snapshot. */
export function writeSessionUI(
    queryClient: QueryClient,
    updater: Updater<
        UserCustomizationResponse | undefined,
        UserCustomizationResponse | undefined
    >,
): void {
    queryClient.setQueryData(profileUiQueryKey(), updater);
}
