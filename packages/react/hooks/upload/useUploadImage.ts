import { ImageResponse, UploadTypeEnum } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { createMutation } from '../core/useMutation';

type UploadImageVariables = {
    uploadType: UploadTypeEnum;
    file: File | Blob;
};

/**
 * Hook for uploading an image
 */
export function useUploadImage(
    options?: Omit<
        UseMutationOptions<ImageResponse, Error, UploadImageVariables>,
        'mutationFn'
    >,
): UseMutationResult<ImageResponse, Error, UploadImageVariables> {
    return createMutation<ImageResponse, Error, UploadImageVariables>(
        (client, { uploadType, file }) =>
            client.upload.uploadImage(uploadType, file),
        undefined, // No invalidation needed as uploads don't affect existing data
    )(options);
}
