'use client';

import type { Operations } from '@unpic/core/base';
import {
    Image as UnpicImage,
    type ImageProps as UnpicImageProps,
} from '@unpic/react/base';

import { cn } from '@/utils/cn';
import { imgproxyTransformer } from '@/utils/imgproxy';

type Props = Omit<UnpicImageProps<Operations, undefined>, 'transformer'> & {
    transitionDisabled?: boolean;
    unoptimized?: boolean;
};

const Image = ({
    alt,
    className,
    transitionDisabled,
    background,
    unoptimized,
    src,
    ...props
}: Props) => {
    const resolvedClassName = cn(
        'text-transparent',
        !transitionDisabled && 'animate-[fade-in_0.2s_ease-in-out]',
        className,
    );

    const imageProps = {
        ...props,
        src,
        transformer: (str, operations) =>
            imgproxyTransformer(str, operations, unoptimized),
        className: resolvedClassName,
        background: background ?? 'var(--muted)',
        alt: alt ?? '',
    } as UnpicImageProps<Operations, undefined>;

    return <UnpicImage {...imageProps} />;
};

export default Image;
