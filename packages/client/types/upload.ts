/**
 * Upload related types
 */

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
