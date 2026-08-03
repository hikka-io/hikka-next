import type { FC, ReactNode } from 'react';

import Image from '@/components/ui/image';
import { cn } from '@/utils/cn';
import { IMAGE_PRESETS } from '@/utils/constants/image-presets';

import MaterialSymbolsImageNotSupportedOutlineRounded from '../icons/material-symbols/MaterialSymbolsImageNotSupportedOutlineRounded';

export type CardImageProps = {
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    alt?: string;
    width?: number;
    height?: number;
    sizes?: string;
};

type Props = {
    image?: string | ReactNode;
    className?: string;
    imageProps?: CardImageProps;
    containerRatio?: number;
    blurred?: boolean;
};

const DEFAULT_PRESET = IMAGE_PRESETS.card;
const BLUR_WIDTH = 96;

const CardImage: FC<Props> = ({
    image,
    className,
    imageProps,
    containerRatio,
    blurred,
}) => {
    if (!image) {
        return (
            <MaterialSymbolsImageNotSupportedOutlineRounded className="text-4xl text-muted-foreground" />
        );
    }

    if (typeof image !== 'string') {
        return image;
    }

    const { width, height, sizes, ...rest } = imageProps || {};

    // Blurred posters are never revealed, so a heavy blur(16px) hides any
    // detail finer than ~16px. Requesting a tiny source (instead of the
    // full card resolution) is visually identical but cuts download +
    // decode cost by ~10x across a list of NSFW cards.
    if (blurred) {
        return (
            <Image
                width={BLUR_WIDTH}
                height={
                    containerRatio
                        ? Math.round(BLUR_WIDTH / containerRatio)
                        : 137
                }
                sizes={`${BLUR_WIDTH}px`}
                src={image}
                className={cn(
                    // max-*-full! defeats unpic's inline max-width/height
                    // (set from the small width/height above) so the image
                    // fills the card instead of being capped at 96px.
                    'absolute inset-0 size-full! max-h-full! max-w-full! object-cover blur-lg',
                    className,
                )}
                alt="Poster"
                loading="lazy"
            />
        );
    }

    const resolvedWidth = width ?? DEFAULT_PRESET.width;

    return (
        <Image
            width={resolvedWidth}
            height={
                height ??
                (containerRatio
                    ? Math.round(resolvedWidth / containerRatio)
                    : DEFAULT_PRESET.height)
            }
            sizes={sizes ?? DEFAULT_PRESET.sizes}
            src={image}
            className={cn('max-h-full! max-w-full!', className)}
            alt="Poster"
            {...(Object.keys(rest).length > 0 ? rest : { loading: 'lazy' })}
        />
    );
};

export default CardImage;
