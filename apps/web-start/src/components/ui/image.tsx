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
};

const Image = ({
    alt,
    className,
    transitionDisabled,
    background,
    ...props
}: Props) => {
    const imageProps = {
        ...props,
        transformer: imgproxyTransformer,
        className: cn(
            'text-transparent',
            !transitionDisabled && 'animate-[fade-in_0.2s_ease-in-out]',
            className,
        ),
        background: background ?? 'var(--muted)',
        alt: alt ?? '',
    } as UnpicImageProps<Operations, undefined>;

    return <UnpicImage {...imageProps} />;
};

export default Image;
