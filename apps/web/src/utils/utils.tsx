import { type ClassValue, clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

/** Tailwind CSS classnames merge. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function withProps<T extends React.ElementType>(
    Component: T,
    defaultProps: Partial<React.ComponentPropsWithoutRef<T>>,
) {
    const ComponentWithClassName = Component as React.FC<{
        className?: string;
    }>;

    return React.forwardRef<
        React.ComponentRef<T>,
        React.ComponentPropsWithoutRef<T>
    >(function ExtendComponent(props, ref) {
        const newProps: any = { ...defaultProps, ...props };
        const className = cn(
            (defaultProps as any).className,
            (props as any).className,
        );

        if (className) {
            newProps.className = className;
        }

        return <ComponentWithClassName ref={ref} {...newProps} />;
    });
}

export const canvasToBlob = async ({
    canvas,
    quality = 0.85,
    type = 'image/jpeg',
}: {
    canvas: HTMLCanvasElement;
    quality?: number;
    type?: string;
}) => {
    const dataUrl = canvas.toDataURL(type, quality);
    const res = await fetch(dataUrl);

    return await res.blob();
};

export const blobToFile = ({
    blob,
    fileName,
}: {
    blob: Blob;
    fileName: string;
}) => {
    const b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return blob as File;
};

export const getImage = async ({
    canvas,
    quality = 0.7,
}: {
    canvas: HTMLCanvasElement;
    quality?: number;
}) => {
    let blob = await canvasToBlob({ canvas });

    if (blob.size > 100000) {
        blob = await canvasToBlob({ canvas, quality });
    }

    const file = blobToFile({
        blob,
        fileName: 'avatar.jpg',
    });

    return file;
};

interface ConvertPngToJpegOptions {
    file: File | Blob;
    quality?: number; // 0.0 to 1.0, default 0.9
    backgroundColor?: string; // default 'white'
    outputFormat?: 'dataUrl' | 'blob'; // default 'dataUrl'
    maxWidth?: number; // optional resize
    maxHeight?: number; // optional resize
}

interface ConvertPngToJpegResult {
    dataUrl?: string;
    blob?: Blob;
    width: number;
    height: number;
    originalSize: number;
    convertedSize: number;
}

export async function convertPngToJpeg(
    options: ConvertPngToJpegOptions,
): Promise<ConvertPngToJpegResult> {
    const {
        file,
        quality = 0.9,
        backgroundColor = 'black',
        outputFormat = 'dataUrl',
        maxWidth,
        maxHeight,
    } = options;

    // Validate quality
    if (quality < 0 || quality > 1) {
        throw new Error('Quality must be between 0 and 1');
    }

    // Read the file as data URL
    const fileDataUrl = await readFileAsDataUrl(file);

    // Load the image
    const img = await loadImage(fileDataUrl);

    // Calculate dimensions (with optional resize)
    const dimensions = calculateDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight,
    );

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    // Fill background (important for transparency)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    // Convert to JPEG
    const result: ConvertPngToJpegResult = {
        width: dimensions.width,
        height: dimensions.height,
        originalSize: file.size,
        convertedSize: 0,
    };

    if (outputFormat === 'blob') {
        const blob = await canvasToBlob({ canvas, quality });
        result.blob = blob;
        result.convertedSize = blob.size;
    } else {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        result.dataUrl = dataUrl;
        result.convertedSize = estimateDataUrlSize(dataUrl);
    }

    return result;
}

const readFileAsDataUrl = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

const calculateDimensions = (
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number,
    maxHeight?: number,
): { width: number; height: number } => {
    let width = originalWidth;
    let height = originalHeight;

    if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
};

const estimateDataUrlSize = (dataUrl: string): number => {
    // Remove the data URL prefix to get base64 string
    const base64 = dataUrl.split(',')[1];
    // Estimate size (base64 is ~33% larger than binary)
    return Math.round((base64.length * 3) / 4);
};

export const validateRedirectUrl = (url: string): string => {
    try {
        const parsed = new URL(url, window.location.origin);

        if (parsed.origin === window.location.origin) {
            return parsed.pathname + parsed.search;
        }
    } catch (e) {
        console.error(e);
    }

    return '/';
};
