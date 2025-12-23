'use client';

import { IgnoredNotificationsResponse, UserAppearance } from '@hikka/client';

import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseChangeDescriptionParams,
    UseChangeEmailParams,
    UseChangePasswordParams,
    UseChangeUsernameParams,
    UseDeleteImageParams,
    UseDeleteReadListParams,
    UseDeleteWatchListParams,
    UseExportListsParams,
    UseIgnoredNotificationsParams,
    UseImportReadListParams,
    UseImportWatchListParams,
    UseUpdateIgnoredNotificationsParams,
} from '@/types/settings';

/**
 * Hook for getting ignored notification types
 */
export function useIgnoredNotifications({
    ...rest
}: QueryParams<IgnoredNotificationsResponse> &
    UseIgnoredNotificationsParams = {}) {
    return useQuery({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        ...rest,
    });
}

/**
 * Hook for updating ignored notification types
 */
export const useUpdateIgnoredNotifications = createMutation({
    mutationFn: (client, args: UseUpdateIgnoredNotificationsParams) =>
        client.settings.updateIgnoredNotifications(args),
    invalidateQueries: () => [queryKeys.settings.ignoredNotifications()],
});

/**
 * Hook for importing watch list
 */
export const useImportWatchList = createMutation({
    mutationFn: (client, args: UseImportWatchListParams) =>
        client.settings.importWatchList(args),
    invalidateQueries: () => [queryKeys.watch.all],
});

/**
 * Hook for importing read list
 */
export const useImportReadList = createMutation({
    mutationFn: (client, args: UseImportReadListParams) =>
        client.settings.importReadList(args),
    invalidateQueries: () => [queryKeys.read.all],
});

/**
 * Hook for exporting user lists
 */
export const useExportLists = createMutation({
    mutationFn: (client, _args: UseExportListsParams = {}) =>
        client.settings.exportLists(),
    invalidateQueries: () => [],
});

/**
 * Hook for deleting watch list
 */
export const useDeleteWatchList = createMutation({
    mutationFn: (client, _args: UseDeleteWatchListParams = {}) =>
        client.settings.deleteWatchList(),
    invalidateQueries: () => [queryKeys.watch.all],
});

/**
 * Hook for deleting read list
 */
export const useDeleteReadList = createMutation({
    mutationFn: (client, { contentType }: UseDeleteReadListParams) =>
        client.settings.deleteReadList(contentType),
    invalidateQueries: (args) => [queryKeys.read.all],
});

/**
 * Hook for changing user description
 */
export const useChangeDescription = createMutation({
    mutationFn: (client, args: UseChangeDescriptionParams) =>
        client.settings.changeDescription(args),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});

/**
 * Hook for changing user password
 */
export const useChangePassword = createMutation({
    mutationFn: (client, args: UseChangePasswordParams) =>
        client.settings.changePassword(args),
    invalidateQueries: () => [queryKeys.settings.userProfile()],
});

/**
 * Hook for changing username
 */
export const useChangeUsername = createMutation({
    mutationFn: (client, args: UseChangeUsernameParams) =>
        client.settings.changeUsername(args),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});

/**
 * Hook for changing email
 */
export const useChangeEmail = createMutation({
    mutationFn: (client, args: UseChangeEmailParams) =>
        client.settings.changeEmail(args),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});

/**
 * Hook for deleting user image (avatar or cover)
 */
export const useDeleteImage = createMutation({
    mutationFn: (client, { imageType }: UseDeleteImageParams) =>
        client.settings.deleteImage(imageType),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});

/**
 * Hook for updating a user's UI appearance config
 */
export const useUpdateUserUI = createMutation<
    UserAppearance,
    Error,
    { appearance: Omit<UserAppearance, 'username'> }
>({
    mutationFn: (client, { appearance }) =>
        client.settings.updateUserUI(appearance),
    invalidateQueries: () => [queryKeys.user.ui('me')],
});
