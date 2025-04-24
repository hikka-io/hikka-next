import {
    DescriptionArgs,
    EmailArgs,
    ImageType,
    PasswordArgs,
    UsernameArgs,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

/**
 * Hook for changing user description
 */
export const useChangeDescription = createMutation({
    mutationFn: (client, args: DescriptionArgs) =>
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
    mutationFn: (client, args: PasswordArgs) =>
        client.settings.changePassword(args),
    invalidateQueries: () => [queryKeys.settings.userProfile()],
});

/**
 * Hook for changing username
 */
export const useChangeUsername = createMutation({
    mutationFn: (client, args: UsernameArgs) =>
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
    mutationFn: (client, args: EmailArgs) => client.settings.changeEmail(args),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});

/**
 * Hook for deleting user image (avatar or cover)
 */
export const useDeleteImage = createMutation({
    mutationFn: (client, imageType: ImageType) =>
        client.settings.deleteImage(imageType),
    invalidateQueries: () => [
        queryKeys.settings.userProfile(),
        queryKeys.user.me(),
    ],
});
