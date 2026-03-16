import type { Operations } from '@unpic/core/base';

const IMGPROXY_URL = import.meta.env.VITE_IMGPROXY_URL;

const ALLOWED_SOURCES = ['cdn.hikka.io'];

const DEFAULT_QUALITY = 80;

function isAllowedSource(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ALLOWED_SOURCES.some(
            (domain) => parsed.hostname === domain,
        );
    } catch {
        return false;
    }
}

function buildProcessingOptions(
    operations: Operations,
): string {
    const parts: string[] = [];

    const width = operations.width != null ? Number(operations.width) : 0;
    const height = operations.height != null ? Number(operations.height) : 0;

    if (width > 0 || height > 0) {
        parts.push(`rs:fill:${width}:${height}`);
    }
    parts.push(`q:${DEFAULT_QUALITY}`);

    if (operations.format) {
        parts.push(`f:${operations.format}`);
    }

    return parts.join('/');
}

export function imgproxyTransformer(
    src: string | URL,
    operations: Operations,
): string {
    const sourceUrl = typeof src === 'string' ? src : src.toString();

    if (!IMGPROXY_URL || !isAllowedSource(sourceUrl)) {
        return sourceUrl;
    }

    const processingOptions = buildProcessingOptions(operations);

    return `${IMGPROXY_URL}/insecure/${processingOptions}/plain/${sourceUrl}`;
}
