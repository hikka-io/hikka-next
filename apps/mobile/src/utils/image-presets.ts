import {
    buildImgproxyUrl,
    IMAGE_PRESET_SIZES,
    type ImagePresetName,
} from '@hikka/core';

const IMGPROXY_URL =
    process.env.EXPO_PUBLIC_IMGPROXY_URL ?? 'https://img.hikka.io';

// Phones draw at up to 3 pixels per point.
const MAX_PIXEL_RATIO = 3;

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

/** The image resized for a box of `width` x `height` points (avatars, covers); square boxes are cropped to fill. */
export function sizedImageUrl(
    src: string | null | undefined,
    width: number,
    height?: number,
) {
    return src
        ? buildImgproxyUrl(
              IMGPROXY_URL,
              src,
              {
                  width: Math.ceil(width * MAX_PIXEL_RATIO),
                  height:
                      height === undefined
                          ? undefined
                          : Math.ceil(height * MAX_PIXEL_RATIO),
              },
              height === width ? 'fill' : 'fit',
          )
        : undefined;
}
