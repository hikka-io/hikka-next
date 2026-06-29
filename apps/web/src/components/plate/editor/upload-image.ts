import { UploadTypeEnum, uploadImage } from '@hikka/api';

import { convertPngToJpeg } from '@/utils/image';

/** Max attachment size accepted by the backend (2 MB). */
const ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;

/** Mimes the attachment endpoint accepts without conversion. */
const ATTACHMENT_PASSTHROUGH_MIMES = [
    'image/jpeg',
    'image/webp',
    'image/gif',
] as const;

export type AttachmentClassification = 'passthrough' | 'convert' | 'reject';

/**
 * Decide how a file should be handled before an attachment upload, based on
 * its mime type only. Size is checked separately (after any conversion).
 */
export function classifyAttachmentType(mime: string): AttachmentClassification {
    if ((ATTACHMENT_PASSTHROUGH_MIMES as readonly string[]).includes(mime)) {
        return 'passthrough';
    }

    // SVG cannot be safely rasterized; anything non-image is unusable.
    if (mime === 'image/svg+xml' || !mime.startsWith('image/')) {
        return 'reject';
    }

    return 'convert';
}

function isWithinAttachmentSize(size: number): boolean {
    return size <= ATTACHMENT_MAX_BYTES;
}

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
    file: File,
    options?: UploadAttachmentOptions,
): Promise<{ url: string }> {
    const prepared = await prepareAttachmentFile(file);

    const { data } = await uploadImage({
        path: { upload_type: UploadTypeEnum.ATTACHMENT },
        body: { file: prepared },
        signal: options?.signal,
        throwOnError: true,
    });

    // The generated SDK uses fetch, which cannot report granular upload
    // progress; emit completion so consumers can settle their progress UI.
    options?.onProgress?.(100);

    return { url: data.url };
}
