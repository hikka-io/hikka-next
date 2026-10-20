import type { Operations } from '@unpic/core/base';

import { buildImgproxyUrl, type ResizeMode } from '@hikka/core';

export type { ResizeMode };

const IMGPROXY_URL = import.meta.env.VITE_IMGPROXY_URL;

export function imgproxyTransformer(
    src: string | URL,
    operations: Operations,
    skip?: boolean,
    resize: ResizeMode = 'fit',
): string {
    const sourceUrl = typeof src === 'string' ? src : src.toString();

    return skip
        ? sourceUrl
        : buildImgproxyUrl(IMGPROXY_URL, sourceUrl, operations, resize);
}
