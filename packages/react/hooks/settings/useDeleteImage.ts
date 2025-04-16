import { ImageTypeEnum, UserResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseDeleteImageOptions
    extends Omit<
        UseMutationOptions<UserResponse, Error, ImageTypeEnum>,
        'mutationFn'
    > {}

/**
 * Hook for deleting a user image (avatar or cover)
 */
export function useDeleteImage(
    params: UseDeleteImageOptions = {},
): UseMutationResult<UserResponse, Error, ImageTypeEnum> {
    return createMutation<UserResponse, Error, ImageTypeEnum>(
        (client, imageType) => client.settings.deleteImage(imageType),
        () => [
            // Invalidate user profile to reflect the image deletion
            queryKeys.user.me(),
        ],
    )(params);
}
