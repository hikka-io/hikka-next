import { UploadTypeEnum } from '@hikka/client';

import { createMutation } from '../../core/useMutation';

/**
 * Upload image variables type
 */
type UploadImageVariables = {
    uploadType: UploadTypeEnum;
    file: File | Blob;
};

/**
 * Hook for uploading an image
 */
export const useUploadImage = createMutation({
    mutationFn: (client, args: UploadImageVariables) =>
        client.upload.uploadImage(args.uploadType, args.file),
    invalidateQueries: () => [],
});
