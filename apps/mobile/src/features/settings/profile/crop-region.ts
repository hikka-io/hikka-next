type CropRegion = {
    originX: number;
    originY: number;
    width: number;
    height: number;
};

/** The largest centred region of an image with the given width / height ratio, in whole pixels. */
export function centredCrop(
    imageWidth: number,
    imageHeight: number,
    ratio: number,
): CropRegion {
    const width = Math.min(imageWidth, Math.floor(imageHeight * ratio));
    const height = Math.min(imageHeight, Math.round(width / ratio));

    return {
        originX: Math.floor((imageWidth - width) / 2),
        originY: Math.floor((imageHeight - height) / 2),
        width,
        height,
    };
}
