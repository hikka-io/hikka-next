import { UploadTypeEnum, uploadImage } from '@hikka/api';

import { convertPngToJpeg } from '@/utils/image';

// Mirrors `validate_upload_file` in the backend `app/upload/dependencies.py`.
const ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;
const ATTACHMENT_SIDE = { min: 200, max: 2000 } as const;

const JPEG_QUALITIES = [0.9, 0.8, 0.65] as const;

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
    'too-large': `Зображення завелике (максимум ${ATTACHMENT_MAX_BYTES / 1024 / 1024} МБ).`,
    'too-small': `Зображення замале: щонайменше ${ATTACHMENT_SIDE.min}×${ATTACHMENT_SIDE.min} пікселів.`,
    'animation-too-big': `Анімація завелика: до ${ATTACHMENT_SIDE.max} пікселів по кожній стороні.`,
    'too-elongated': `Зображення надто видовжене: після зменшення до ${ATTACHMENT_SIDE.max} пікселів коротша сторона стане меншою за ${ATTACHMENT_SIDE.min}.`,
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

const readImageSize = async (file: File) => {
    const url = URL.createObjectURL(file);

    try {
        const img = new Image();
        img.src = url;
        await img.decode();

        return { width: img.naturalWidth, height: img.naturalHeight };
    } finally {
        URL.revokeObjectURL(url);
    }
};

const VP8X_ANIMATION_FLAG = 0x02;

/** GIFs, and WebPs whose extended header sets the animation flag. */
async function isAnimated(file: File) {
    if (file.type === 'image/gif') return true;
    if (file.type !== 'image/webp') return false;

    const header = new Uint8Array(await file.slice(0, 21).arrayBuffer());
    const text = (start: number) =>
        String.fromCharCode(...header.subarray(start, start + 4));

    return (
        text(0) === 'RIFF' &&
        text(8) === 'WEBP' &&
        text(12) === 'VP8X' &&
        (header[20] & VP8X_ANIMATION_FLAG) !== 0
    );
}

async function encodeJpeg(file: File, quality: number) {
    const { blob } = await convertPngToJpeg({
        file,
        quality,
        outputFormat: 'blob',
        maxWidth: ATTACHMENT_SIDE.max,
        maxHeight: ATTACHMENT_SIDE.max,
    });

    return blob!;
}

/**
 * Fit a file to the backend's attachment contract. Images that are too large
 * or in another format are re-encoded as JPEG, scaled down and compressed
 * until they fit; animations pass through untouched, so an oversized one is
 * rejected rather than flattened. Throws {@link UploadValidationError}.
 */
export async function prepareAttachmentFile(file: File): Promise<File | Blob> {
    const classification = classifyAttachmentType(file.type);

    if (classification === 'reject') {
        throw new UploadValidationError('unsupported-type');
    }

    const { width, height } = await readImageSize(file).catch(() => {
        throw new UploadValidationError('decode-failed');
    });

    if (width < ATTACHMENT_SIDE.min || height < ATTACHMENT_SIDE.min) {
        throw new UploadValidationError('too-small');
    }

    const longest = Math.max(width, height);
    const oversized = longest > ATTACHMENT_SIDE.max;
    const fits = !oversized && isWithinAttachmentSize(file.size);

    if (classification === 'passthrough' && fits) return file;

    if (await isAnimated(file)) {
        throw new UploadValidationError(
            oversized ? 'animation-too-big' : 'too-large',
        );
    }

    const scale = Math.min(1, ATTACHMENT_SIDE.max / longest);
    if (Math.min(width, height) * scale < ATTACHMENT_SIDE.min) {
        throw new UploadValidationError('too-elongated');
    }

    for (const quality of JPEG_QUALITIES) {
        const encoded = await encodeJpeg(file, quality).catch(() => {
            throw new UploadValidationError('decode-failed');
        });

        if (isWithinAttachmentSize(encoded.size)) return encoded;
    }

    throw new UploadValidationError('too-large');
}

/** Whether trying the same file again can succeed (a network or server hiccup, not a rejected file). */
export const isRetryableUploadError = (code?: string) =>
    !code ||
    (!(code in UPLOAD_VALIDATION_MESSAGES) && !code.startsWith('upload:'));

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
