import { HikkaClient, UploadTypeEnum } from '@hikka/client';

import { convertPngToJpeg } from '@/utils/image';

/**
 * Uploads an attachment image, converting PNG to JPEG first. Shared by the
 * image-group toolbar button and the editor drag-and-drop upload option.
 */
export async function uploadAttachmentImage(client: HikkaClient, file: File) {
    if (file.type.includes('png')) {
        const result = await convertPngToJpeg({
            file,
            outputFormat: 'blob',
        });

        return client.upload.createImageUpload(
            UploadTypeEnum.ATTACHMENT,
            result.blob!,
        );
    }

    return client.upload.createImageUpload(UploadTypeEnum.ATTACHMENT, file);
}
