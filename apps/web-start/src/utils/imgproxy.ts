import type { Operations } from '@unpic/core/base';

const IMGPROXY_URL = import.meta.env.VITE_IMGPROXY_URL;

const ALLOWED_SOURCES = ['cdn.hikka.io'];

function isAllowedSource(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ALLOWED_SOURCES.some((domain) => parsed.hostname === domain);
    } catch {
        return false;
    }
}

function buildProcessingOptions(operations: Operations): string {
    const parts: string[] = [];

    const width =
        operations.width != null ? Math.round(Number(operations.width)) : 0;
    const height =
        operations.height != null ? Math.round(Number(operations.height)) : 0;

    if (width > 0 || height > 0) {
        parts.push(`rs:fill:${width}:${height}`);
    }

    return parts.join('/');
}

export function imgproxyTransformer(
    src: string | URL,
    operations: Operations,
    skip?: boolean,
): string {
    const sourceUrl = typeof src === 'string' ? src : src.toString();

    if (skip || !IMGPROXY_URL || !isAllowedSource(sourceUrl)) {
        return sourceUrl;
    }

    const processingOptions = buildProcessingOptions(operations);

    if (!processingOptions) {
        return `${IMGPROXY_URL}/insecure/plain/${sourceUrl}`;
    }

    return `${IMGPROXY_URL}/insecure/${processingOptions}/plain/${sourceUrl}`;
}
