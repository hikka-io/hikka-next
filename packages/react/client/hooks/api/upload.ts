'use client';

import { UploadTypeEnum } from '@hikka/client';

import { createMutation } from '@/client/useMutation';
import { queryKeys } from '@/core';

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
export const useCreateImageUpload = createMutation({
    mutationFn: (client, args: UploadImageVariables) =>
        client.upload.createImageUpload(args.uploadType, args.file),
    invalidateQueries: (args: UploadImageVariables) =>
        args.uploadType !== UploadTypeEnum.ATTACHMENT
            ? [queryKeys.user.me(), queryKeys.user.byUsername(args.uploadType)]
            : [],
});
