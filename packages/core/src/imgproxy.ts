const ALLOWED_SOURCES = ['cdn.hikka.io'];

/** Pixel sizes of the poster presets (2x the largest rendered box). */
export const IMAGE_PRESET_SIZES = {
    card: { width: 400, height: 572 },
    cardLg: { width: 480, height: 686 },
    cardSm: { width: 320, height: 458 },
    cardXs: { width: 112, height: 160 },
} as const;

export type ImagePresetName = keyof typeof IMAGE_PRESET_SIZES;

export type ResizeMode = 'fit' | 'fill';

type Size = { width?: number | string; height?: number | string };

function isAllowedSource(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ALLOWED_SOURCES.some((domain) => parsed.hostname === domain);
    } catch {
        return false;
    }
}

function processingOptions(size: Size, resize: ResizeMode): string {
    const width = size.width != null ? Math.round(Number(size.width)) : 0;
    const height = size.height != null ? Math.round(Number(size.height)) : 0;

    return width > 0 || height > 0 ? `rs:${resize}:${width}:${height}:0:0` : '';
}

/** A resized imgproxy URL for a Hikka CDN image; any other source is returned as is. */
export function buildImgproxyUrl(
    imgproxyUrl: string | undefined,
    src: string,
    size: Size,
    resize: ResizeMode = 'fit',
): string {
    if (!imgproxyUrl || !isAllowedSource(src)) {
        return src;
    }

    const options = processingOptions(size, resize);

    return options
        ? `${imgproxyUrl}/insecure/${options}/plain/${src}`
        : `${imgproxyUrl}/insecure/plain/${src}`;
}
