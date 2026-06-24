/**
 * Upload related types
 */

import { BaseRequestOptionsArgs } from './common';

/**
 * Upload type enum
 */
export enum UploadTypeEnum {
    ATTACHMENT = 'attachment',
    AVATAR = 'avatar',
    COVER = 'cover',
}

/**
 * Image response
 */
export interface ImageResponse {
    url: string;
}

/** Max attachment size accepted by the backend (2 MB). */
export const ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;

/** Mimes the attachment endpoint accepts without conversion. */
export const ATTACHMENT_PASSTHROUGH_MIMES = [
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

export function isWithinAttachmentSize(size: number): boolean {
    return size <= ATTACHMENT_MAX_BYTES;
}

/** Options for {@link UploadModule.createImageUpload}. */
export interface CreateImageUploadOptions extends BaseRequestOptionsArgs {
    /** When provided, the upload runs via XHR so progress can be reported. */
    onUploadProgress?: (percent: number) => void;
    signal?: AbortSignal;
}
