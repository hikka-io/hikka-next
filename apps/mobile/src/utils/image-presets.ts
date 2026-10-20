import { PixelRatio } from 'react-native';

import {
    buildImgproxyUrl,
    IMAGE_PRESET_SIZES,
    type ImagePresetName,
} from '@hikka/core';

const IMGPROXY_URL =
    process.env.EXPO_PUBLIC_IMGPROXY_URL ?? 'https://img.hikka.io';

// Denser screens than this gain nothing visible from bigger downloads.
const MAX_PIXEL_RATIO = 3;

const PRESETS_BY_WIDTH = (
    Object.keys(IMAGE_PRESET_SIZES) as ImagePresetName[]
).sort((a, b) => IMAGE_PRESET_SIZES[a].width - IMAGE_PRESET_SIZES[b].width);

const pixels = (points: number) =>
    Math.ceil(points * Math.min(PixelRatio.get(), MAX_PIXEL_RATIO));

/** The smallest poster preset that covers a box `width` points wide on this screen, else the largest. */
export function presetForWidth(width: number): ImagePresetName {
    const needed = pixels(width);
    return (
        PRESETS_BY_WIDTH.find(
            (name) => IMAGE_PRESET_SIZES[name].width >= needed,
        ) ?? PRESETS_BY_WIDTH[PRESETS_BY_WIDTH.length - 1]
    );
}

/** The image resized by imgproxy to a poster preset, so lists never download originals. */
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
                  width: pixels(width),
                  height: height === undefined ? undefined : pixels(height),
              },
              height === width ? 'fill' : 'fit',
          )
        : undefined;
}
