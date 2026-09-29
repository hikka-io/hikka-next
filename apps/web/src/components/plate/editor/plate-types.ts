import { KEYS, type TElement } from 'platejs';

export const ELEMENT_IMAGE = 'image';
export const ELEMENT_IMAGE_GROUP = 'image_group';
export const ELEMENT_IMAGE_PLACEHOLDER = 'image_placeholder';
export const ELEMENT_VIDEO = 'video';
export const ELEMENT_SPOILER = 'spoiler';
export const ELEMENT_SPOILER_INLINE = 'spoiler_inline';

export const MAX_IMAGE_COUNT = 4;

export const CONTAINER_BLOCK_TYPES: ReadonlySet<string> = new Set([
    KEYS.blockquote,
    ELEMENT_SPOILER,
]);

export interface TImageElement extends TElement {
    type: typeof ELEMENT_IMAGE;
    url: string;
}

export interface TVideoElement extends TElement {
    type: typeof ELEMENT_VIDEO;
    url: string;
}

export interface TImageGroupElement extends TElement {
    type: typeof ELEMENT_IMAGE_GROUP;
    children: (TImageElement | TElement)[];
}

export type ImagePlaceholderStatus = 'uploading' | 'error';

export interface TImagePlaceholderElement extends TElement {
    type: typeof ELEMENT_IMAGE_PLACEHOLDER;
    id: string;
    name: string;
    previewUrl: string;
    status: ImagePlaceholderStatus;
    progress: number;
    error?: { code?: string; message: string };
}
