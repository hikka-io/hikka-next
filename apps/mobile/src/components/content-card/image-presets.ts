import {
    buildImgproxyUrl,
    IMAGE_PRESET_SIZES,
    type ImagePresetName,
} from '@hikka/core';

const IMGPROXY_URL =
    process.env.EXPO_PUBLIC_IMGPROXY_URL ?? 'https://img.hikka.io';

/**
 * The image resized by imgproxy to a poster preset, so lists never download
 * originals: `cardLg` for a detail hero, `cardSm` for row and grid cards,
 * `cardXs` for horizontal-card thumbnails.
 */
export function presetImageUrl(
    src: string | null | undefined,
    preset: ImagePresetName,
) {
    return src
        ? buildImgproxyUrl(IMGPROXY_URL, src, IMAGE_PRESET_SIZES[preset])
        : undefined;
}
