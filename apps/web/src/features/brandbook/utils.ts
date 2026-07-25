import { canvasToBlob } from '@/utils/image';

export type RasterFormat = 'png' | 'jpg' | 'webp';

const MIME_TYPES: Record<RasterFormat, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    webp: 'image/webp',
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

type DownloadImageOptions = {
    src: string;
    format: RasterFormat;
    fileName: string;
    width: number;
    background?: string;
};

/**
 * Converts an image (SVG or raster) to the given raster format via canvas
 * and triggers a download, so no pre-generated files are needed.
 */
export const downloadImage = async ({
    src,
    format,
    fileName,
    width,
    background,
}: DownloadImageOptions) => {
    const img = await loadImage(src);

    const height = Math.round((img.naturalHeight / img.naturalWidth) * width);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // JPEG has no alpha channel — flatten onto the asset background.
    if (format === 'jpg' && background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob({
        canvas,
        type: MIME_TYPES[format],
        quality: 0.92,
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
};
