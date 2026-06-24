import {
    HikkaClient,
    UploadTypeEnum,
    classifyAttachmentType,
    isWithinAttachmentSize,
} from '@hikka/client';

import { convertPngToJpeg } from '@/utils/image';

export const UPLOAD_VALIDATION_MESSAGES = {
    'too-large': 'Зображення завелике (максимум 2 МБ).',
    'unsupported-type': 'Непідтримуваний формат зображення.',
    'decode-failed': 'Не вдалося обробити зображення.',
} as const;

export type UploadValidationCode = keyof typeof UPLOAD_VALIDATION_MESSAGES;

/** Thrown by {@link prepareAttachmentFile} for client-side validation failures. */
export class UploadValidationError extends Error {
    code: UploadValidationCode;

    constructor(code: UploadValidationCode) {
        super(UPLOAD_VALIDATION_MESSAGES[code]);
        this.name = 'UploadValidationError';
        this.code = code;
    }
}

export interface UploadAttachmentOptions {
    onProgress?: (percent: number) => void;
    signal?: AbortSignal;
}

/**
 * Validate and, when needed, transcode a file so it satisfies the backend's
 * attachment contract (jpeg/webp/gif, ≤2 MB). Animated gif/webp pass through
 * unchanged; png/bmp/etc. are converted to JPEG; svg and non-images are
 * rejected. Throws {@link UploadValidationError} on failure.
 */
export async function prepareAttachmentFile(file: File): Promise<File | Blob> {
    const classification = classifyAttachmentType(file.type);

    if (classification === 'reject') {
        throw new UploadValidationError('unsupported-type');
    }

    let prepared: File | Blob = file;

    if (classification === 'convert') {
        try {
            const result = await convertPngToJpeg({
                file,
                outputFormat: 'blob',
            });
            prepared = result.blob!;
        } catch {
            throw new UploadValidationError('decode-failed');
        }
    }

    if (!isWithinAttachmentSize(prepared.size)) {
        throw new UploadValidationError('too-large');
    }

    return prepared;
}

/**
 * Prepare then upload an attachment image. Shared by the image-group toolbar
 * button and the editor drag-and-drop / paste path. Propagates
 * UploadValidationError (client-side) and HikkaApiError (backend).
 */
export async function uploadAttachmentImage(
    client: HikkaClient,
    file: File,
    options?: UploadAttachmentOptions,
) {
    const prepared = await prepareAttachmentFile(file);

    return client.upload.createImageUpload(
        UploadTypeEnum.ATTACHMENT,
        prepared,
        {
            onUploadProgress: options?.onProgress,
            signal: options?.signal,
        },
    );
}
